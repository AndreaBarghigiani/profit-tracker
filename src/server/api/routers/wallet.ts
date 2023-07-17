// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { weeklyWithdraws } from "./transaction/weeklyWithdraws";
import { currencyConverter } from "@/utils/string";
import { sumInterests } from "./transaction/sumInterests";

// Types
import type { PrismaClient } from "@prisma/client";

export const getWallet = async ({
  userId,
  prisma,
}: {
  userId: string;
  prisma: PrismaClient;
}) => {
  return await prisma.wallet.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });
};

export const removeFromLiquidFunds = async ({
  walletId,
  amount,
  prisma,
}: {
  walletId: string;
  amount: number;
  prisma: PrismaClient;
}) => {
  return await prisma.wallet.update({
    where: {
      id: walletId,
    },
    data: {
      liquidFunds: {
        decrement: amount,
      },
    },
  });
};

export const walletRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return getWallet({
      userId: ctx.session.user.id,
      prisma: ctx.prisma,
    });
  }),
  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const projectTotals = await ctx.prisma.project.aggregate({
      where: {
        userId: ctx.session.user.id,
      },
      _sum: {
        exposure: true,
        deposit: true,
        profits: true,
      },
    });

    const hodlTotals = await ctx.prisma.hodl.aggregate({
      where: {
        userId: ctx.session.user.id,
      },
      _sum: {
        exposure: true,
        profits: true,
      },
    });

    const totals = {
      exposure:
        (projectTotals._sum.exposure ?? 0) + (hodlTotals._sum.exposure ?? 0),
      deposit: projectTotals._sum.deposit ?? 0,
      profits:
        (projectTotals._sum.profits ?? 0) + (hodlTotals._sum.profits ?? 0),
    };

    const wallet = await ctx.prisma.wallet.findUniqueOrThrow({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const interests = await sumInterests(ctx.session.user.id, ctx.prisma);

    return {
      wallet,
      interests,
      totals,
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
  getWalletProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.wallet.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        project: true,
      },
    });
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
