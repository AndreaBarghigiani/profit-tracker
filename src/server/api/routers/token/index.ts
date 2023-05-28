// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { updateMarketData } from "./updateMarketData";

// Types

export const tokenRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.token.findUniqueOrThrow({
        where: {
          coingecko_id: input.tokenId,
        },
      });
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

      // Check if I have all the info needed otherwise update the token
      const tokenToUpdate = tokens.some(
        (token) => !token.iconUrl || !token.latestPrice
      );

      if (tokenToUpdate) {
        return await updateMarketData({
          tokenIds: tokens.map((token) => token.coingecko_id),
        });
      }

      return tokens;
    }),
});
