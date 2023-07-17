import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
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

  const expositionDiff = !!isExposed
    ? input.evaluation - isExposed.exposure
    : input.evaluation;

  const depositDiff = !!isExposed
    ? input.evaluation - isExposed.deposit
    : input.evaluation;

  const exposure = expositionDiff >= 0 ? 0 : { decrement: input.evaluation };
  const deposit = depositDiff >= 0 ? 0 : { decrement: input.evaluation };

  const transaction = {
    create: {
      type: TransactionType.WITHDRAW,
      amount: input.evaluation,
      evaluation: input.evaluation,
    },
  };

  await ctx.prisma.project.update({
    where: {
      id: input.projectId,
    },
    data: {
      exposure,
      deposit,
      moneyAtWork: {
        decrement: input.evaluation,
      },
      // I souldn't count "taking back my money" as profit
      // profits: {
      //   increment: !!isExposed ? isExposed.exposure : input.evaluation,
      // },
      transaction,
    },
  });
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
				a. user is not exposed, then increment profits by the evaluation
				b. user is exposed, then increment profits by the difference
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
  get: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      // evaluate to add sumProjectInterests
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
  listByCurrentUser: protectedProcedure
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

      const { useLiquidFunds, ...rest } = input;

      await ctx.prisma.project.create({
        data: {
          ...rest,
          exposure: rest.deposit,
          deposit: rest.deposit,
          moneyAtWork: rest.deposit,
          userId: ctx.session.user.id,
          walletId,
          transaction: {
            create: {
              type: TransactionType.DEPOSIT,
              amount: rest.deposit,
              evaluation: rest.deposit,
            },
          },
        },
      });

      if (useLiquidFunds) {
        await ctx.prisma.wallet.update({
          where: {
            id: walletId,
          },
          data: {
            liquidFunds: {
              decrement: rest.deposit,
            },
          },
        });
      }
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
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.delete({
        where: {
          id: input,
        },
      });
    }),
});
