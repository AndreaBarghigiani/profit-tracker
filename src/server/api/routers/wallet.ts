import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { weeklyWithdraws } from "./transaction/weeklyWithdraws";
import { currencyConverter } from "@/utils/string";
import { sumInterests } from "./transaction/sumInterests";

export const walletRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.wallet.findUniqueOrThrow({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const wallet = await ctx.prisma.wallet.findUniqueOrThrow({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const interests = await sumInterests(ctx.session.user.id, ctx.prisma);

    return {
      wallet,
      interests,
    };
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
    return currencyConverter({ amount: weekly / 7 - goal });
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
