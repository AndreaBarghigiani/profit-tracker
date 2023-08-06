// Utils
import { z } from "zod";
import { prisma } from "@/server/db";

// Types

import type { Token } from "@prisma/client";
import type { UpdateTokenData } from "@/server/types";

const CoinGeckoPricesSchema = z.object({
  usd: z.number(),
  usd_24h_change: z.number(),
  usd_market_cap: z.number(),
});

const CoinGeckoPricesResponseSchema = z.record(
  z.string().min(1),
  CoinGeckoPricesSchema,
);

type CoinGeckoPricesResponse = z.infer<typeof CoinGeckoPricesResponseSchema>;

export const updatePrices = async ({
  tokenIds,
}: {
  tokenIds: string[];
}): Promise<Token[]> => {
  console.log("from updatePrices");
  const url = new URL("https://api.coingecko.com/api/v3/simple/price");
  url.searchParams.set("vs_currencies", "usd");
  url.searchParams.set("ids", tokenIds.join(","));
  url.searchParams.set("include_market_cap", "true");
  url.searchParams.set("include_24hr_change", "true");

  const response = await fetch(url);
  // console.log("after fetch response", response);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: CoinGeckoPricesResponse = CoinGeckoPricesResponseSchema.parse(
    await response.json(),
  );
  // const data: CoinGeckoPricesResponse = await response.json();

  console.log("data:", data);
  const objectKeys = <Obj extends CoinGeckoPricesResponse>(
    obj: Obj,
  ): (keyof Obj)[] => {
    return Object.keys(obj) as (keyof Obj)[];
  };

  // console.log("objectKeys(data):", objectKeys(data));
  const prices = objectKeys(data).map((key) => {
    return {
      coingecko_id: key,
      latestPrice: data[key]?.usd ?? 0,
      change24h: data[key]?.usd_24h_change ?? 0,
    };
  });

  const updateToken = async (token: UpdateTokenData) => {
    return await prisma.token.update({
      where: {
        coingecko_id: token.coingecko_id,
      },
      data: {
        latestPrice: token.latestPrice,
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
    return Promise.all(prices.map((token) => updateToken(token)));
  };

  return updateTokens();
};
