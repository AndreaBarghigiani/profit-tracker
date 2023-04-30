import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const walletRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.wallet.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
