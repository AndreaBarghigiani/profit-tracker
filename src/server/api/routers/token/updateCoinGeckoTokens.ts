// Utils
import { z } from "zod";
import { prisma } from "@/server/db";

// Types
import { CoinGeckoCoinsMarketSchema } from "@/server/types";
import type { UpdateTokenData } from "@/server/types";

export const updateCoinGeckoTokens = async ({
  coinGeckoTokens,
}: {
  coinGeckoTokens: string[];
}) => {
  const CoinGeckoUrl = new URL(
    "https://api.coingecko.com/api/v3/coins/markets",
  );
  const now = new Date();
  const halfHour = now.getTime() - 30 * 60000;

  const updatedTokens = await prisma.token.findMany({
    where: {
      coingecko_id: {
        in: coinGeckoTokens,
      },
      AND: [
        {
          updatedAt: {
            lte: new Date(halfHour),
          },
        },
      ],
    },
  });

  // console.log("-------------------");
  // console.log("updatedTokens:", updatedTokens);
  // console.log("-------------------");

  CoinGeckoUrl.searchParams.set("vs_currency", "usd");
  CoinGeckoUrl.searchParams.set("ids", coinGeckoTokens.join(","));
  CoinGeckoUrl.searchParams.set("locale", "en");
  CoinGeckoUrl.searchParams.set("price_change_percentage", "24h");

  const response = await fetch(CoinGeckoUrl);
  const CoinGeckoData = z
    .array(CoinGeckoCoinsMarketSchema)
    .parse(await response.json());

  const CoinGeckoMassaged: UpdateTokenData[] = CoinGeckoData.map((entry) => ({
    symbol: entry.symbol,
    name: entry.name,
    coingecko_id: entry.id,
    icon_url: entry.image,
    latestPrice: entry.current_price,
    change24h: entry.price_change_24h,
  }));

  return CoinGeckoMassaged;
};
