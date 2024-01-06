//import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { redis } from "@/lib/redis";

// Types
import type { UserCache } from "@/server/types";

const getRedisUser = async (userId: string) => {
  const redisUser: string | null = await redis.get(userId);
  return typeof redisUser === "string"
    ? (JSON.parse(redisUser) as UserCache)
    : null;
};

export const userRouter = createTRPCRouter({
  getRole: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        role: true,
      },
    });
  }),
  getRedisUser: protectedProcedure.query(async ({ ctx }) => {
    return (await getRedisUser(ctx.session.user.id)) as UserCache;
  }),
  delete: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
