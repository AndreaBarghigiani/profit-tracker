// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { HodlValuesSchema } from "@/server/types";

// Types
import { type PrismaClient, TransactionType } from "@prisma/client";

export const getHodl = async ({
  hodlId,
  prisma,
}: {
  hodlId: string;
  prisma: PrismaClient;
}) => {
  return await prisma.hodl.findUniqueOrThrow({
    where: {
      id: hodlId,
    },
  });
};

export const hodlRouter = createTRPCRouter({
  create: protectedProcedure
    .input(HodlValuesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.hodl.create({
        data: {
          currentAmount: input.currentAmount,
          currentEvaluation: input.currentEvaluation,
          totalInvested: input.totalInvested,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          token: {
            connect: {
              coingecko_id: input.tokenId,
            },
          },
          transaction: {
            create: {
              type: TransactionType.BUY,
              amount: input.currentAmount,
              evaluation: input.currentEvaluation,
            },
          },
        },
      });

      // Update the wallet adding the BUY order as Deposit
      await ctx.prisma.wallet.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          totalDeposit: {
            increment: input.currentEvaluation,
          },
        },
      });

      // Update the token to make it trackable
      await ctx.prisma.token.update({
        where: {
          coingecko_id: input.tokenId,
        },
        data: {
          tracked: true,
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ hodlId: z.string() }))
    .query(({ ctx, input }) => {
      return getHodl({ hodlId: input.hodlId, prisma: ctx.prisma });
    }),
  getByTokenId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.hodl.findMany({
      where: {
        tokenId: input,
        userId: ctx.session.user.id,
      },
      take: 1,
    });
  }),
  getTransactions: protectedProcedure
    .input(z.object({ hodlId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.hodl.findUniqueOrThrow({
        where: {
          id: input.hodlId,
        },
        select: {
          createdAt: true,
          transaction: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    }),
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.hodl.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        token: true,
      },
    });
  }),
  // delete: protectedProcedure
  //   .input(z.string())
  //   .mutation(async ({ ctx, input }) => {
  //     const allProjectTx = await ctx.prisma.transaction.groupBy({
  //       by: ["type"],
  //       where: {
  //         project: {
  //           id: input,
  //         },
  //       },
  //       _sum: {
  //         amount: true,
  //       },
  //     });

  //     const sortList = ["WITHDRAW", "DEPOSIT", "INTEREST"];

  //     const ordered = ensureAllTransactionTypes(allProjectTx).sort(
  //       (a, b) => sortList.indexOf(a.type) - sortList.indexOf(b.type)
  //     );

  //     const removeFromWallet = ordered.reduce(
  //       (acc, cur) =>
  //         cur.type === "WITHDRAW"
  //           ? acc - cur._sum.amount
  //           : acc + cur._sum.amount,
  //       0
  //     );
  //     console.log("to be removed", removeFromWallet);

  //     await ctx.prisma.wallet.update({
  //       where: {
  //         userId: ctx.session.user.id,
  //       },
  //       data: {
  //         total: {
  //           decrement: removeFromWallet,
  //         },
  //         totalDeposit: {
  //           decrement: removeFromWallet,
  //         },
  //       },
  //     });

  //     await ctx.prisma.project.delete({
  //       where: {
  //         id: input,
  //       },
  //     });
  //   }),
});
