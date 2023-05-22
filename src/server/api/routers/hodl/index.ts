// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { HodlValuesSchema } from "@/server/types";

// Types
import { TransactionType } from "@prisma/client";

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
            connect: { id: ctx.session.user.id },
          },
          token: {
            connect: { coinranking_uuid: input.tokenId },
          },
          transaction: {
            create: {
              type: TransactionType.BUY,
              amount: input.currentEvaluation,
            },
          },
        },
      });

      // Update the wallet with new project holdings
      await ctx.prisma.wallet.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          total: {
            increment: input.currentEvaluation,
          },
          totalDeposit: {
            increment: input.currentEvaluation,
          },
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.hodl.findMany({
      where: {
        tokenId: input,
        userId: ctx.session.user.id,
      },
      take: 1,
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
