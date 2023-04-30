import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import { ProjectValuesSchema } from "@/pages/project/add";

export const projectRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany();
  }),
  get: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
      });
    }),
  create: protectedProcedure
    .input(ProjectValuesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.create({
        data: {
          ...input,
          user: {
            connect: { id: ctx.session.user.id },
          },
          transaction: {
            create: {
              type: "DEPOSIT",
              amount: input.initial,
            },
          },
        },
        include: {
          transaction: true,
        },
      });

      // Add deposit to wallet
      await ctx.prisma.wallet.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          total: {
            increment: input.initial,
          },
          totalDeposit: {
            increment: input.initial,
          },
        },
      });
    }),
});
