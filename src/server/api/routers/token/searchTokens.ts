// Utils

// Types
import { CoinGeckoSearchResponseSchema } from "@/server/types";
import type { PrismaClient } from "@prisma/client";

export const searchTokens = async ({
  query,
  prisma,
}: {
  query: string;
  prisma: PrismaClient;
}) => {
  const url = new URL("https://api.coingecko.com/api/v3/search");
  url.searchParams.set("query", query);

  const response = await fetch(url);
  const { coins } = CoinGeckoSearchResponseSchema.parse(await response.json());

  if (!coins) return [];

  // 1. Check which tokens are already in the database
  const tokensInDatabase = await prisma.token.findMany({
    select: {
      coingecko_id: true,
    },
  });

  const tokenIds = tokensInDatabase.map((token) => token.coingecko_id);

  // 2. Only use the fund ones, the rest will be added via cron later (if present in CG at all)
  const tokens = coins.filter((coin) => tokenIds.includes(coin.id));

  // 3. Get all tokens from the database
  const tokensFromDatabase = await prisma.token.findMany({
    where: {
      coingecko_id: {
        in: tokens.map((token) => token.id),
      },
    },
  });

  // 4. Return all tokens
  return tokensFromDatabase;
};
