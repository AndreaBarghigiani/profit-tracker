import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { redis } from "@/lib/redis";
import { Role } from "@prisma/client";

// Types
import type { UserCache } from "@/server/types";

const getRedisUser = async (userId: string) => {
  const redisUser: string | null = await redis.get(userId);
  return typeof redisUser === "string"
    ? (JSON.parse(redisUser) as UserCache)
    : null;
};

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
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
  hasMembership: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user) return false;

    return user.role === Role.SUBSCRIBER || user.role === Role.ADMIN;
  }),
  updateMembership: protectedProcedure
    .input(z.object({ expirationTime: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const expirationTime = new Date(Number(input.expirationTime) * 1000);
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          expirationDate: expirationTime,
          role: Role.SUBSCRIBER,
        },
      });
    }),
  delete: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
