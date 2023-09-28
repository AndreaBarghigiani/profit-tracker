// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// Types
import { WalletAddressSchema } from "@/server/types";
// import type { UserWallet } from "@/server/types";

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
  get: protectedProcedure
    .input(z.object({ walletAddress: WalletAddressSchema }))
    .query(async ({ ctx, input }) => {
      const walletAddress = await ctx.prisma.userWallet.findUnique({
        where: {
          walletAddress: input.walletAddress,
        },
      });

      return !!walletAddress;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.userWallet.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.object({ walletId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.userWallet.delete({
        where: {
          id: input.walletId,
        },
      });
    }),
});
