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
  const url = new URL(`https://api.dexscreener.com/latest/dex/tokens/${query}`);

  const response = await fetch(url);
  const { pairs } = DexSearchSchema.parse(await response.json());

  if (!pairs || pairs.length < 0) throw new Error("No pairs found");

  const token = formatDexPairAsToken(pairs);

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
