// Utils
import { z } from "zod";
import { prisma } from "@/server/db";

// Types
import type { Token } from "@prisma/client";
import type { UpdateTokenData } from "@/server/types";
import { CoinGeckoCoinsMarketSchema, DexSearchSchema } from "@/server/types";
import { formatDexPairAsToken } from "@/utils/positions";

export const updateMarketData = async ({
  tokenIds,
}: {
  tokenIds: string[];
}): Promise<Token[]> => {
  // Split tokens between custom and CoinGecko
  const customTokens = tokenIds.filter((id) => id.startsWith("custom-"));
  const coingeckoTokens = tokenIds.filter((id) => !id.startsWith("custom-"));
  console.log("----------------");
  console.log("customTokens:", customTokens);
  console.log("coingeckoTokens:", coingeckoTokens);
  console.log("----------------");

  // Update data for CoinGecko tokens
  const CoinGeckoUrl = new URL(
    "https://api.coingecko.com/api/v3/coins/markets",
  );
  CoinGeckoUrl.searchParams.set("vs_currency", "usd");
  CoinGeckoUrl.searchParams.set("ids", coingeckoTokens.join(","));
  CoinGeckoUrl.searchParams.set("locale", "en");
  CoinGeckoUrl.searchParams.set("price_change_percentage", "24h");

  const response = await fetch(CoinGeckoUrl);
  const CoinGeckoData = z
    .array(CoinGeckoCoinsMarketSchema)
    .parse(await response.json());

  const CoinGeckoMassaged: UpdateTokenData[] = CoinGeckoData.map((entry) => ({
    coingecko_id: entry.id,
    icon_url: entry.image,
    latestPrice: entry.current_price,
    change24h: entry.price_change_24h,
  }));

  // Update data for custom tokens, max 30 tokens at a time
  const customAddresses = customTokens
    .map((token) => token.replace("custom-", ""))
    .join(",");
  const DexScreenerUrl = new URL(
    `https://api.dexscreener.com/latest/dex/tokens/${customAddresses}`,
  );

  const DexScreenerResponse = await fetch(DexScreenerUrl);
  const { pairs } = DexSearchSchema.parse(await DexScreenerResponse.json());
  const DexToken = formatDexPairAsToken({ pairs });

  const massaged = [...CoinGeckoMassaged, DexToken];

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
