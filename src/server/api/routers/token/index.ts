import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const tokenRouter = createTRPCRouter({
  sample: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.token.findMany({
      take: 12,
    });
  }),
  find: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.token.findMany({
        where: {
          OR: [
            {
              name: {
                search: input.query,
              },
            },
            {
              symbol: {
                search: input.query,
              },
            },
          ],
        },
        take: 12,
      });
    }),
});
