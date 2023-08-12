// Types
import type { ChartTokenData } from "@/server/types";
import { CoinGeckoChartSchema } from "@/server/types";

export const getReChartData = async ({ tokenId }: { tokenId: string }) => {
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

    function reducer(acc: ChartTokenData, cur: number[], index: number) {
      if (cur.length < 2 || index % 6) return acc;

      const date = new Date(cur[0] as number);
      const formatDate = Intl.DateTimeFormat("en-EN", {
        timeStyle: "short",
      }).format(date);

      acc.push({
        date: formatDate,
        price: cur[1] as number,
      });

      return acc;
    }

    return data.prices.reduce(reducer, []);
  }

  return [];
};
