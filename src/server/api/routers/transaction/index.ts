import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import { TransactionValuesSchema } from "@/server/types";
import { TransactionType as TxType } from "@prisma/client";
import { addInterest } from "./addInterest";
import { getAllProjectsIds } from "../project/getAllProjectsIds";
import { lastInterestByProjectId } from "./lastInterestByProjectId";
import { sumTransactions } from "./sumTransactions";
import { sumInterests } from "./sumInterests";
import { weeklyWithdraws } from "./weeklyWithdraws";

export const transactionRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        orderBy: z.union([z.literal("asc"), z.literal("desc")]).default("asc"),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.transaction.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: [
          {
            createdAt: input.orderBy,
          },
        ],
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
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  listPaginatedByCurrentUser: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        type: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const type = input.type ?? {};
      const { cursor } = input;
      const items = await ctx.prisma.transaction.findMany({
        take: limit + 1, // +1 for the cursor
        where: {
          type: (type ? type : TransactionValuesSchema.parse(type)) as TxType,
          OR: [
            {
              project: {
                userId: ctx.session.user.id,
              },
            },
            {
              hodl: {
                userId: ctx.session.user.id,
              },
            },
          ],
        },
        select: {
          id: true,
          amount: true,
          type: true,
          createdAt: true,
          project: {
            select: {
              name: true,
              id: true,
            },
          },
          hodl: {
            select: {
              token: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
  lastWeekWithdraws: protectedProcedure.query(async ({ ctx }) => {
    return weeklyWithdraws(ctx.prisma);
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
    .input(z.object({ projectId: z.string(), projectAccruing: z.boolean() }))
    .query(async ({ ctx, input }) => {
      return await lastInterestByProjectId(
        input.projectId,
        input.projectAccruing,
        ctx.prisma
      );
    }),
  sumTransactions: protectedProcedure.query(async ({ ctx }) => {
    return await sumTransactions(ctx.prisma, ctx.session.user.id);
  }),
  sumInterests: protectedProcedure.query(async ({ ctx }) => {
    return await sumInterests(ctx.prisma, ctx.session.user.id);
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
          ...(input.type === TxType.DEPOSIT && {
            totalDeposit: {
              increment: input.amount,
            },
          }),
          ...(input.type === TxType.WITHDRAW && {
            totalWithdraw: {
              increment: input.amount,
            },
          }),
        },
      });
    }),
});
