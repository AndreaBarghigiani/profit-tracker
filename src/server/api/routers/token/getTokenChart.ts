// Types
import type { ChartTokenData } from "@/server/types";
import { CoinGeckoChartSchema } from "@/server/types";

export const getChartData = async ({
  tokenId,
}: {
  tokenId: string;
}): Promise<ChartTokenData> => {
  let massaged: ChartTokenData = {
    index: [],
    prices: [],
  };

  // Unable to find data for custom tokens
  // For now this is good enough
  if (!tokenId.startsWith("custom-")) {
    const url = new URL(
      `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart`,
    );
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("days", "1");

    const response = await fetch(url);
    const data = CoinGeckoChartSchema.parse(await response.json());

    const initialReduce: ChartTokenData = { index: [], prices: [] };

    function reducer(acc: ChartTokenData, cur: number[], index: number) {
      if (cur.length < 2 || index % 6) return acc;

      acc.index.push(new Date(cur[0] as number));
      acc.prices.push(cur[1] as number);

      return acc;
    }

    massaged = data.prices.reduce(reducer, initialReduce);
  }

  return massaged;
};
