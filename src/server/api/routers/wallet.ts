import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const walletRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.wallet.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  lastTransaction: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.wallet.findFirstOrThrow({
      cursor: {
        id: ctx.session.user.id,
      },
      select: {
        lastInterestAccrued: true,
      },
    });
  }),
});
