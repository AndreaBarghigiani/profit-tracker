import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import { TransactionValuesSchema } from "@/pages/transaction/new";

const mapFrequency: Record<string, number> = {
  daily: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  weekly: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  monthly: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  yearly: 365 * 24 * 60 * 60 * 1000, // 365 days in milliseconds
};

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
  // This runs via cron
  addInterest: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
      });

      if (!project) return;

      // 1.1 Check if we need to run based on incrementFrequency
      const lastTransaction = await ctx.prisma.transaction.findFirst({
        where: {
          projectId: input.projectId,
          type: "INTEREST",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const projectFrequencyHours = mapFrequency[project.increaseFrequency];
      const currentTime = new Date().getTime();
      let timeToAddInterest = false;

      if (lastTransaction) {
        const timeDiff =
          currentTime - new Date(lastTransaction?.createdAt).getTime();
        timeToAddInterest = timeDiff > projectFrequencyHours;
      } else {
        const firstDeposit = await ctx.prisma.transaction.findFirst({
          where: {
            projectId: input.projectId,
            type: "deposit",
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        const timeDiff =
          currentTime - new Date(firstDeposit?.createdAt).getTime();
        timeToAddInterest = timeDiff > projectFrequencyHours;
      }

      if (!timeToAddInterest) return;

      // 1. calculate interest amount
      const amount: number = project?.compound
        ? project.currentHolding * (project.increaseAmount / 100)
        : project.initial * (project.increaseAmount / 100);

      // 2. add new transaction with interest amount
      await ctx.prisma.transaction.create({
        data: {
          amount,
          projectId: input.projectId,
          type: "INTEREST",
        },
      });

      // 3. update project currentHolding
      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          currentHolding: {
            increment: amount,
          },
        },
      });

      // 4. update wallet with new project holdings
      await ctx.prisma.wallet.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          total: {
            increment: amount,
          },
        },
      });
    }),
  // Only for manual deposits or withdraws
  create: protectedProcedure
    .input(TransactionValuesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.transaction.create({ data: input });

      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          currentHolding: {
            ...(input.type === "WITHDRAW" && { decrement: input.amount }),
            ...(input.type === "DEPOSIT" && { increment: input.amount }),
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
            ...(input.type === "WITHDRAW" && { decrement: input.amount }),
            ...(input.type === "DEPOSIT" && { increment: input.amount }),
          },
          totalDeposit: {
            ...(input.type === "DEPOSIT" && { increment: input.amount }),
          },
          totalWithdraw: {
            ...(input.type === "WITHDRAW" && { increment: input.amount }),
          },
        },
      });
    }),
});
