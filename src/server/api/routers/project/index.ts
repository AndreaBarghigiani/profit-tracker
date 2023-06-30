import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { ensureAllTransactionTypes } from "../transaction/sumTransactions";
import { getWallet } from "../wallet";

// Types
import { TransactionType } from "@prisma/client";
import {
  EditProjectValuesSchema,
  ProjectValuesSchema,
  ProjectTransactionSchema,
  type ProjectTransaction,
} from "@/server/types";
import type { Session } from "next-auth";
import type { PrismaClient } from "@prisma/client";

export const getProject = async ({
  projectId,
  prisma,
}: {
  projectId: string;
  prisma: PrismaClient;
}) => {
  const project = await prisma.project.findUniqueOrThrow({
    where: {
      id: projectId,
    },
  });

  return project;
};

export const isUserExposed = async ({
  ctx,
  input,
}: {
  ctx: { prisma: PrismaClient; session: Session };
  input: ProjectTransaction;
}) => {
  const isExposed = await ctx.prisma.project.findFirst({
    where: {
      userId: ctx.session.user.id,
      id: input.projectId,
      exposure: {
        gt: 0,
      },
    },
  });

  return isExposed;
};

// This is for TransactionType.DEPOSIT
export const makeDeposit = async ({
  ctx,
  input,
}: {
  ctx: { prisma: PrismaClient; session: Session };
  input: ProjectTransaction;
}) => {
  await ctx.prisma.project.update({
    where: {
      id: input.projectId,
    },
    data: {
      exposure: {
        increment: input.amount,
      },
      deposit: {
        increment: input.amount,
      },
      moneyAtWork: {
        increment: input.amount,
      },
      transaction: {
        create: {
          amount: input.amount,
          evaluation: input.evaluation,
          type: input.type,
        },
      },
    },
  });
};

// This is for TransactionType.REMOVE
export const removeDeposit = async ({
  ctx,
  input,
}: {
  ctx: { prisma: PrismaClient; session: Session };
  input: ProjectTransaction;
}) => {
  const isExposed = await isUserExposed({ ctx, input });

  const diff = !!isExposed
    ? input.evaluation - isExposed.exposure
    : input.evaluation;

  const transaction = {
    create: {
      type: TransactionType.WITHDRAW,
      amount: input.evaluation,
      evaluation: input.evaluation,
    },
  };

  if (diff > 0) {
    await ctx.prisma.project.update({
      where: {
        id: input.projectId,
      },
      data: {
        exposure: 0,
        deposit: {
          decrement: input.evaluation,
        },
        moneyAtWork: {
          decrement: input.evaluation,
        },
        profits: {
          increment: !!isExposed ? isExposed.exposure : input.evaluation,
        },
        transaction,
      },
    });
  }
};
// This is for TransactionType.WITHDRAW
export const makeWithdraw = async ({
  ctx,
  input,
}: {
  ctx: { prisma: PrismaClient; session: Session };
  input: ProjectTransaction;
}) => {
  // Check if user isExposed
  const isExposed = await isUserExposed({ ctx, input });
  const diff = isExposed
    ? input.evaluation - isExposed.exposure
    : input.evaluation;
  const exposure = diff >= 0 ? 0 : { decrement: input.evaluation };
  /*
		Profits are calculated like so:
			1. if the difference is greater than 0:
				a. if the user is not exposed, then increment profits by the evaluation
				b. if the user is exposed, then increment profits by the difference
			2. if the difference is less than 0, then profits are the same as before
	*/
  const profits =
    diff >= 0
      ? !isExposed
        ? { increment: input.evaluation }
        : { increment: diff }
      : isExposed?.profits;

  const transaction = {
    create: {
      type: TransactionType.WITHDRAW,
      amount: input.evaluation,
      evaluation: input.evaluation,
    },
  };

  const project = {
    update: [
      {
        where: {
          id: input.projectId,
        },
        data: {
          exposure,
          interest: {
            decrement: input.evaluation,
          },
          profits,
          transaction,
        },
      },
    ],
  };

  await ctx.prisma.wallet.update({
    where: {
      userId: ctx.session.user.id,
    },
    data: {
      liquidFunds: {
        increment: input.evaluation,
      },
      project,
    },
  });
};

export const projectRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany();
  }),
  get: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return getProject({
        projectId: input.projectId,
        prisma: ctx.prisma,
      });
    }),
  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findMany({
        where: {
          userId: input.userId,
        },
      });
    }),
  getByCurrentUser: protectedProcedure
    .input(
      z
        .object({ orderBy: z.union([z.literal("asc"), z.literal("desc")]) })
        .optional()
    )
    .query(({ ctx, input }) => {
      const orderBy = input?.orderBy ? input.orderBy : "asc";

      return ctx.prisma.project.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: [
          {
            name: orderBy,
          },
        ],
      });
    }),
  update: protectedProcedure
    .input(EditProjectValuesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
  create: protectedProcedure
    .input(ProjectValuesSchema)
    .mutation(async ({ ctx, input }) => {
      const walletId = (
        await getWallet({ userId: ctx.session.user.id, prisma: ctx.prisma })
      ).id;
      await ctx.prisma.project.create({
        data: {
          ...input,
          exposure: input.deposit,
          deposit: input.deposit,
          moneyAtWork: input.deposit,
          userId: ctx.session.user.id,
          walletId,
          transaction: {
            create: {
              type: TransactionType.DEPOSIT,
              amount: input.deposit,
              evaluation: input.deposit,
            },
          },
        },
      });
    }),
  transaction: protectedProcedure
    .input(ProjectTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      switch (input.type) {
        case TransactionType.DEPOSIT:
          await makeDeposit({ ctx, input });
          break;
        case TransactionType.REMOVE:
          await removeDeposit({ ctx, input });
          break;
        case TransactionType.WITHDRAW:
          await makeWithdraw({ ctx, input });
      }
    }),
  // deposit: protectedProcedure
  //   .input(ProjectTransactionSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.prisma.wallet.update({
  //       where: {
  //         userId: ctx.session.user.id,
  //       },
  //       data: {
  //         exposure: {
  //           increment: input.evaluation,
  //         },
  //         totalDeposit: {
  //           increment: input.evaluation,
  //         },
  //         project: {
  //           update: [
  //             {
  //               where: {
  //                 id: input.projectId,
  //               },
  //               data: {
  //                 exposure: {
  //                   increment: input.evaluation,
  //                 },
  //                 deposit: {
  //                   increment: input.evaluation,
  //                 },
  //                 transaction: {
  //                   create: {
  //                     amount: input.amount,
  //                     evaluation: input.evaluation,
  //                     type: input.type,
  //                   },
  //                 },
  //               },
  //             },
  //           ],
  //         },
  //       },
  //     });
  //   }),
  // withdraw: protectedProcedure
  //   .input(ProjectTransactionSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.prisma.wallet.update({
  //       where: {
  //         userId: ctx.session.user.id,
  //       },
  //       data: {
  //         exposure: {
  //           decrement: input.evaluation,
  //         },
  //         totalDeposit: {
  //           decrement: input.evaluation,
  //         },
  //         project: {
  //           update: [
  //             {
  //               where: {
  //                 id: input.projectId,
  //               },
  //               data: {
  //                 exposure: {
  //                   decrement: input.evaluation,
  //                 },
  //                 transaction: {
  //                   create: {
  //                     amount: input.amount,
  //                     evaluation: input.evaluation,
  //                     type: input.type,
  //                   },
  //                 },
  //               },
  //             },
  //           ],
  //         },
  //       },
  //     });
  //   }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const allProjectTx = await ctx.prisma.transaction.groupBy({
        by: ["type"],
        where: {
          project: {
            id: input,
          },
        },
        _sum: {
          amount: true,
          evaluation: true,
        },
      });

      const sortList = ["WITHDRAW", "DEPOSIT", "INTEREST"];

      const ordered = ensureAllTransactionTypes(allProjectTx).sort(
        (a, b) => sortList.indexOf(a.type) - sortList.indexOf(b.type)
      );

      const removeFromWallet = ordered.reduce(
        (acc, cur) =>
          cur.type === "WITHDRAW"
            ? acc - cur._sum.evaluation
            : acc + cur._sum.evaluation,
        0
      );

      await ctx.prisma.wallet.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          exposure: {
            decrement: removeFromWallet,
          },
          totalDeposit: {
            decrement: removeFromWallet,
          },
        },
      });

      await ctx.prisma.project.delete({
        where: {
          id: input,
        },
      });
    }),
});
