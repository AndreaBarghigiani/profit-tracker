// Utils
import { z } from "zod";
import { prisma } from "@/server/db";
import { log } from "next-axiom";

// Types
import { CoinGeckoCoinsMarketSchema } from "@/server/types";
import type { UpdateTokenData } from "@/server/types";

export const updateCoinGeckoTokens = async ({
  coinGeckoTokens,
}: {
  coinGeckoTokens: string[];
}) => {
  const tokensToUpdate = await prisma.token.findMany({
    where: {
      coingecko_id: {
        in: coinGeckoTokens,
      },
    },
  });

  const tokensToUpdateIds = tokensToUpdate.map((token) => token.coingecko_id);

  if (tokensToUpdateIds.length === 0) return [];

  const CoinGeckoUrl = new URL(
    "https://api.coingecko.com/api/v3/coins/markets",
  );
  CoinGeckoUrl.searchParams.set("vs_currency", "usd");
  CoinGeckoUrl.searchParams.set("ids", tokensToUpdateIds.join(","));
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  log.debug("updateCoingeckoTokens", { tokensToUpdate, CoinGeckoMassaged });

  return CoinGeckoMassaged;
};
