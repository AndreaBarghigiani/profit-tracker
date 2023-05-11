import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { weeklyWithdraws } from "./transaction/weeklyWithdraws";

export const walletRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.wallet.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getDailyPassiveResult: protectedProcedure.query(async ({ ctx }) => {
    const dailyGoal = await ctx.prisma.wallet.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        dailyProfit: true,
      },
    });

    const goal = dailyGoal?.dailyProfit ?? 0;
    const weekly = await weeklyWithdraws(ctx.prisma);
    const calculate = weekly / 7 - goal;
    if (calculate < 0) {
      return `-$${Math.abs(calculate).toFixed(2)}`;
    } else {
      return `$${calculate}`;
    }
  }),
  updateDaily: protectedProcedure
    .input(z.object({ dailyProfit: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.wallet.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          dailyProfit: input.dailyProfit,
        },
      });
    }),
});
