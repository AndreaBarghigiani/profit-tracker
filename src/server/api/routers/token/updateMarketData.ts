// Utils
import { z } from "zod";
import { prisma } from "@/server/db";

// Types
import type { Token } from "@prisma/client";
import type { UpdateTokenData } from "@/server/types";
import { CoinGeckoCoinsMarketSchema } from "@/server/types";

export const updateMarketData = async ({
  tokenIds,
}: {
  tokenIds: string[];
}): Promise<Token[]> => {
  const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("ids", tokenIds.join(","));
  url.searchParams.set("locale", "en");

  const response = await fetch(url);
  const data = z.array(CoinGeckoCoinsMarketSchema).parse(await response.json());

  const massaged: UpdateTokenData[] = data.map((entry) => {
    return {
      coingecko_id: entry.id,
      icon_url: entry.image,
      latestPrice: entry.current_price.toString(),
    };
  });

  const updateToken = async (token: UpdateTokenData) => {
    return await prisma.token.update({
      where: {
        coingecko_id: token.coingecko_id,
      },
      data: {
        latestPrice: token.latestPrice,
        iconUrl: token.icon_url,
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
