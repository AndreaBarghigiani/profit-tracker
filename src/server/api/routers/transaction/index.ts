import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import { TransactionValuesSchema } from "@/server/types";
import type { TransactionType as TxType } from "@prisma/client";
import { addInterest } from "./addInterest";
import { getAllProjectsIds } from "../project/getAllProjectsIds";
import { lastInterestByProjectId } from "./lastInterestByProjectId";
import { sumTransactions } from "./sumTransactions";
import { sumInterests } from "./sumInterests";
import { weeklyWithdraws } from "./weeklyWithdraws";
import { sumProjectInterests } from "./sumProjectInterests";

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
          evaluation: true,
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
              id: true,
              token: {
                select: {
                  name: true,
                  symbol: true,
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
  addInterestToAllProjects: publicProcedure
    .input(z.optional(z.object({ skip: z.boolean().default(false) })))
    .mutation(async ({ ctx, input }) => {
      const projects = await getAllProjectsIds({ prisma: ctx.prisma });
      const skip = input?.skip ?? false;

      for (const project of projects) {
        await addInterest(project.id, ctx.prisma, skip);
      }
    }),
  // Per project specific
  addInterest: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        skip: z.boolean().default(false).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const skip = input?.skip ?? false;

      return await addInterest(input.projectId, ctx.prisma, skip);
    }),
  projectInterest: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await sumProjectInterests(input.projectId, ctx.prisma);
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
    return await sumTransactions(ctx.session.user.id, ctx.prisma);
  }),
  sumInterests: protectedProcedure.query(async ({ ctx }) => {
    return await sumInterests(ctx.session.user.id, ctx.prisma);
  }),
  create: protectedProcedure.input(TransactionValuesSchema).mutation(({}) => {
    // Leaving here for historical purposes
    // Probably will be deleted in the future
  }),
  delete: protectedProcedure
    .input(z.object({ transactionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.transaction.delete({
        where: {
          id: input.transactionId,
        },
      });
    }),
});
