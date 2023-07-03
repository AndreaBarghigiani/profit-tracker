// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TransactionValuesSchema } from "@/server/types";
import { ensureAllTransactionTypes } from "../transaction/sumTransactions";
import { getWallet } from "../wallet";

// Types
import { type PrismaClient, TransactionType } from "@prisma/client";

export const getHodl = async ({
  hodlId,
  prisma,
}: {
  hodlId: string;
  prisma: PrismaClient;
}) => {
  return await prisma.hodl.findUniqueOrThrow({
    where: {
      id: hodlId,
    },
    include: {
      token: true,
    },
  });
};

export const hodlRouter = createTRPCRouter({
  create: protectedProcedure
    .input(TransactionValuesSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.tokenId) return;

      const walletId = (
        await getWallet({ userId: ctx.session.user.id, prisma: ctx.prisma })
      ).id;

      const position = await ctx.prisma.hodl.create({
        data: {
          amount: input.amount,
          exposure: input.evaluation,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          wallet: {
            connect: {
              id: walletId,
            },
          },
          token: {
            connect: {
              coingecko_id: input.tokenId,
            },
          },
          transaction: {
            create: {
              type: TransactionType.BUY,
              amount: input.amount,
              evaluation: input.evaluation,
            },
          },
        },
      });

      // Update the token to make it trackable
      await ctx.prisma.token.update({
        where: {
          coingecko_id: input.tokenId,
        },
        data: {
          tracked: true,
        },
      });

      return position;
    }),
  get: protectedProcedure
    .input(z.object({ hodlId: z.string() }))
    .query(({ ctx, input }) => {
      return getHodl({ hodlId: input.hodlId, prisma: ctx.prisma });
    }),
  getByTokenId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.hodl.findMany({
      where: {
        tokenId: input,
        userId: ctx.session.user.id,
      },
      take: 1,
    });
  }),
  getByCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.hodl.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        token: true,
      },
    });
  }),
  getTransactions: protectedProcedure
    .input(z.object({ hodlId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.hodl.findUniqueOrThrow({
        where: {
          id: input.hodlId,
        },
        select: {
          createdAt: true,
          transaction: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    }),
  getCardData: protectedProcedure
    .input(z.object({ hodlId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.hodl.findUniqueOrThrow({
        where: {
          id: input.hodlId,
        },
        include: {
          token: true,
        },
      });
    }),
  // Right now it's the same as getByCurrentUser
  // list: protectedProcedure.query(({ ctx }) => {
  //   return ctx.prisma.hodl.findMany({
  //     where: {
  //       userId: ctx.session.user.id,
  //     },
  //     include: {
  //       token: true,
  //     },
  //   });
  // }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.hodl.delete({
        where: {
          id: input,
        },
      });
    }),
});
