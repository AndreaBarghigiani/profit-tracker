// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { updateMarketData } from "./updateMarketData";
import { getChartData } from "./getTokenChart";
import { searchTokens } from "./searchTokens";
import { searchDexScreenerTokens } from "./searchDexScreenerTokens";

// Types
import type { PrismaClient, Token } from "@prisma/client";

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

export const getToken = async ({
  tokenId,
  prisma,
}: // withDates = true,
{
  tokenId: string;
  prisma: PrismaClient;
  // withDates?: boolean;
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

export const getSample = async ({ prisma }: { prisma: PrismaClient }) => {
  return await prisma.token.findMany({
    where: {
      coingecko_id: {
        in: sample,
      },
    },
  });
};

export const tokenRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(({ ctx, input }) => {
      return getToken({ tokenId: input.tokenId, prisma: ctx.prisma });
    }),
  sample: protectedProcedure.query(({ ctx }) => {
    return getSample({ prisma: ctx.prisma });
  }),
  getChartData: protectedProcedure
    .input(z.object({ tokenId: z.string(), tokenName: z.string() }))
    .query(async ({ input }) => {
      return await getChartData({
        tokenId: input.tokenId,
      });
    }),
  find: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      let updatedTokens: Token[] = [];
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

      // If token info are older than 1 day, update them
      const currentTime = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      const tokenUpdated = tokens.filter(
        (token) => currentTime - token.updatedAt.getTime() < oneDay,
      );

      const tokenToUpdate = tokens.filter(
        (token) => currentTime - token.updatedAt.getTime() > oneDay,
      );

      if (!!tokenToUpdate) {
        updatedTokens = await updateMarketData({
          tokenIds: tokenToUpdate.map((token) => token.coingecko_id),
        });
      }

      return [...tokenUpdated, ...updatedTokens];
    }),
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      return await searchTokens({ query: input.query, prisma: ctx.prisma });
    }),
  searchDex: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      return await searchDexScreenerTokens({
        query: input.query,
        prisma: ctx.prisma,
      });
    }),
  updatePrice: protectedProcedure
    .input(z.object({ tokenId: z.string() }))
    .mutation(async ({ input }) => {
      return await updateMarketData({ tokenIds: [input.tokenId] });
    }),
});
