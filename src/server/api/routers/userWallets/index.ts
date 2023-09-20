// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userWalletsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ walletAddress: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const wallet = await ctx.prisma.wallet.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
      });

      await ctx.prisma.userWallet.create({
        data: {
          userId: ctx.session.user.id,
          walletId: wallet.id,
          walletAddress: input.walletAddress,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.userWallet.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
