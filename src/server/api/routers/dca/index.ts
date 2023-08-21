// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { DcaStrategySchema } from "@/server/types";
import { getWallet } from "../wallet";

// Types
import { type PrismaClient, TransactionType } from "@prisma/client";
import type { Session } from "next-auth";
import type { HodlTransaction, CalcDiffs } from "@/server/types";

export const dcaRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ hodlId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.dcaStrategy.findUnique({
        where: {
          hodlId: input.hodlId,
        },
        include: {
          dcaSteps: true,
        },
      });
    }),
  create: protectedProcedure
    .input(DcaStrategySchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.hodlId) return;

      const query = await ctx.prisma.dcaStrategy.create({
        data: {
          hodlId: input.hodlId,
          dcaSteps: {
            createMany: {
              data: input.steps,
            },
          },
        },
      });

      return query;
    }),
  update: protectedProcedure
    .input(DcaStrategySchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.hodlId) return;

      const query = await ctx.prisma.dcaStrategy.update({
        where: {
          hodlId: input.hodlId,
        },
        data: {
          dcaSteps: {
            deleteMany: {},
            createMany: {
              data: input.steps,
            },
          },
        },
      });

      return query;
    }),
});
