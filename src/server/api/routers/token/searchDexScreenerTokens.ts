// Utils
import { formatDexPairAsToken } from "@/utils/positions";

// Types
import { DexSearchSchema } from "@/server/types";
import type { PrismaClient } from "@prisma/client";

export const searchDexScreenerTokens = async ({
  query,
  prisma,
}: {
  query: string;
  prisma: PrismaClient;
}) => {
  const encodedQuery = encodeURIComponent(query);
  const url = new URL(
    `https://api.dexscreener.com/latest/dex/tokens/${encodedQuery}`,
  );

  const response = await fetch(url);
  const { pairs } = DexSearchSchema.parse(await response.json());

  const filteredPairs = pairs.filter(
    (pair) => pair.baseToken.address.toLowerCase() === query.toLowerCase(),
  );

  if (!filteredPairs || filteredPairs.length < 0)
    throw new Error("No pairs found");

  const token = formatDexPairAsToken(filteredPairs);

  // 1. Check which tokens are already in the database
  const tokenInDatabase = await prisma.token.findUnique({
    where: {
      coingecko_id: token.coingecko_id,
    },
  });

  // 2. If token is already in the database, update it
  if (!!tokenInDatabase) {
    return await prisma.token.update({
      where: {
        coingecko_id: token.coingecko_id,
      },
      data: {
        latestPrice: token.latestPrice,
        tokenHistory: {
          create: {
            price: token.latestPrice,
          },
        },
      },
    });
  }

  // 3. If token is not in the database, create it
  return await prisma.token.create({
    data: {
      ...token,
      tokenHistory: {
        create: {
          price: token.latestPrice,
        },
      },
    },
  });
};
