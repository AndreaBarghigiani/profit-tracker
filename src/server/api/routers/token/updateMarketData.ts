import { prisma } from "@/server/db";
import type { CoinGeckoCoinsMarkets } from "@/server/types";
import { Token } from "@prisma/client";

type MassagedData = {
  coingecko_id: string;
  icon_url: string;
  latestPrice: string;
};
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
  const data = (await response.json()) as CoinGeckoCoinsMarkets[];

  const massaged: MassagedData[] = data.map((entry) => {
    return {
      coingecko_id: entry.id,
      icon_url: entry.image,
      latestPrice: entry.current_price.toString(),
    };
  });

  const updateToken = async (token: MassagedData) => {
    return await prisma.token.update({
      where: {
        coingecko_id: token.coingecko_id,
      },
      data: {
        latestPrice: token.latestPrice,
        iconUrl: token.icon_url,
      },
    });
  };

  const updateTokens = async () => {
    return Promise.all(massaged.map((token) => updateToken(token)));
  };

  return updateTokens();
};
