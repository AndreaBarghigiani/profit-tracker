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
      const chartData = await getChartData({
        tokenId: input.tokenId,
      });

      const labels = chartData.index.map((item) =>
        new Intl.DateTimeFormat("en-EN", { timeStyle: "short" }).format(item),
      );

      // Maybe we'll need to massage the data a bit more
      // const dataset = isChartDataSuccess
      //   ? chartData.prices.map((item) =>
      //       new Intl.NumberFormat("en-EN", {
      //         style: "currency",
      //         currency: "USD",
      //         minimumFractionDigits: 2,
      //         maximumFractionDigits: 2,
      //       }).format(item)
      //     )
      //   : null;

      const data = {
        labels,
        datasets: [
          {
            label: input.tokenName,
            borderColor: "#e6b400",
            backgroundColor: "#E6B40026",
            data: chartData.prices,
            fill: true,
            pointBackgroundColor: "#e6b400",
            pointHoverRadius: 5,
            pointRadius: 1,
            tension: 0.5,
          },
        ],
      };

      return data;
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
