import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const walletRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.wallet.findUnique({
      where: {
        userId: ctx.session.user.id,
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
