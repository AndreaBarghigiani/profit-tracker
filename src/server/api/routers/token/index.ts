// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { updateMarketData } from "./updateMarketData";

// Types

export const getToken = async ({
  tokenId,
  prisma,
}: {
  tokenId: string;
  prisma: PrismaClient;
}) => {
  return await prisma.token.findFirstOrThrow({
    where: {
      OR: [
        {
          coingecko_id: tokenId,
        },
        {
          id: tokenId,
        },
      ],
    },
  });
};

export const tokenRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(({ ctx, input }) => {
      return getToken({ tokenId: input.tokenId, prisma: ctx.prisma });
    }),
  sample: protectedProcedure.query(async ({ ctx }) => {
    const sample = [
      "bitcoin",
      "ethereum",
      "matic-network",
      "binancecoin",
      "cardano",
      "dogecoin",
      "avalanche-2",
      "cosmos",
      "arbitrum",
    ];

    return ctx.prisma.token.findMany({
      where: {
        coingecko_id: {
          in: sample,
        },
      },
    });
  }),
  find: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const tokens = await ctx.prisma.token.findMany({
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

      const currentTime = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      // Check if I have all the info needed otherwise update the token
      const tokenToUpdate = tokens.some(
        (token) =>
          !token.iconUrl ||
          !token.latestPrice ||
          currentTime - token.updatedAt.getTime() > oneDay
      );

      if (tokenToUpdate) {
        return await updateMarketData({
          tokenIds: tokens.map((token) => token.coingecko_id),
        });
      }

      return tokens;
    }),
  updatePrice: protectedProcedure
    .input(z.object({ tokenId: z.string() }))
    .mutation(async ({ input }) => {
      return await updateMarketData({ tokenIds: [input.tokenId] });
    }),
});
