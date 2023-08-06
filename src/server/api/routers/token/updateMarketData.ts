// Utils
import { z } from "zod";
import { prisma } from "@/server/db";

// Types
import type { Token } from "@prisma/client";
import type { UpdateTokenData } from "@/server/types";
import { updateCoinGeckoTokens } from "./updateCoinGeckoTokens";
import { updateDexScreenerTokens } from "./updateDexScreenerTokens";

export const updateMarketData = async ({
  tokenIds,
}: {
  tokenIds: string[];
}): Promise<Token[]> => {
  // Split tokens between custom and CoinGecko
  let massaged: UpdateTokenData[] = [];

  const dexScreenerTokens = tokenIds.filter((id) => id.startsWith("custom-"));
  const coinGeckoTokens = tokenIds.filter((id) => !id.startsWith("custom-"));

  // Update data for CoinGecko tokens
  if (coinGeckoTokens.length > 0) {
    const CoinGeckoMassaged = await updateCoinGeckoTokens({
      coinGeckoTokens,
    });

    massaged = [...massaged, ...CoinGeckoMassaged];
  }

  // Update data for custom tokens, max 30 tokens at a time
  if (dexScreenerTokens.length > 0) {
    const DexTokens = await updateDexScreenerTokens({
      dexScreenerTokens,
    });

    massaged = [...massaged, ...DexTokens];
  }

  const updateToken = async (token: UpdateTokenData) => {
    return await prisma.token.update({
      where: {
        coingecko_id: token.coingecko_id,
      },
      data: {
        latestPrice: token.latestPrice,
        iconUrl: token.icon_url,
        change24h: token.change24h,
        tokenHistory: {
          create: {
            price: token.latestPrice,
          },
        },
      },
    });
  };

  const updateTokens = async () => {
    return Promise.all(massaged.map((token) => updateToken(token)));
  };

  return updateTokens();
};
