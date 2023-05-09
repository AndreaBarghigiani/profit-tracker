import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import { TransactionValuesSchema } from "@/pages/transaction/add";
import { TransactionType as TxType } from "@prisma/client";
import { addInterest } from "./addInterest";
// import { listAllProjectsIdsByCurrentUser } from "../project/listProjectsIdsByCurrentUser";
import { getAllProjectsIds } from "../project/getAllProjectsIds";
import { lastInterestByProjectId } from "./lastInterestByProjectId";
import { sumTransactions, type MassagedSumTxItem } from "./sumTransactions";

export const transactionRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.transaction.findMany({
        where: {
          projectId: input.projectId,
        },
      });
    }),
  listByCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany({
      where: {
        project: {
          userId: ctx.session.user.id,
        },
      },
      select: {
        id: true,
        amount: true,
        type: true,
        createdAt: true,
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  // This runs via cron
  addInterestToAllProjects: publicProcedure.mutation(async ({ ctx }) => {
    const projects = await getAllProjectsIds({ prisma: ctx.prisma });

    for (const project of projects) {
      await addInterest(project.id, ctx.prisma);
    }
  }),
  // Per project specific
  addInterest: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await addInterest(input.projectId, ctx.prisma);
    }),
  lastTransaction: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await lastInterestByProjectId(input.projectId, ctx.prisma);
    }),
  sumTransactions: protectedProcedure.query(async ({ ctx }) => {
    return await sumTransactions(ctx.prisma);
  }),
  // Only for manual deposits or withdraws
  create: protectedProcedure
    .input(TransactionValuesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.transaction.create({
        data: {
          amount: input.amount,
          type: input.type,
          project: {
            connect: { id: input.projectId },
          },
        },
      });

      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          currentHolding: {
            ...(input.type === TxType.WITHDRAW && {
              decrement: input.amount,
            }),
            ...(input.type === TxType.DEPOSIT && {
              increment: input.amount,
            }),
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
            ...(input.type === TxType.WITHDRAW && {
              decrement: input.amount,
            }),
            ...(input.type === TxType.DEPOSIT && {
              increment: input.amount,
            }),
          },
          totalDeposit: {
            ...(input.type === TxType.DEPOSIT && {
              increment: input.amount,
            }),
          },
          totalWithdraw: {
            ...(input.type === TxType.WITHDRAW && {
              increment: input.amount,
            }),
          },
        },
      });
    }),
});
