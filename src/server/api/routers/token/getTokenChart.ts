// Utils
import { formatTime } from "@/utils/string";
import { ONE_DAY_AGO } from "@/utils/number";

// Types
import type { ChartTokenData, TokenHistory } from "@/server/types";
import type { PrismaClient } from "@prisma/client";
import { CoinGeckoChartSchema } from "@/server/types";

export const getChartData = async ({
  tokenId,
  prisma,
}: {
  tokenId: string;
  prisma: PrismaClient;
}) => {
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
      if (cur.length < 2 || index % 6 || cur[0] === undefined) return acc;

      const date = new Date(cur[0]);
      const formatDate = formatTime(date);

      acc.push({
        date: formatDate,
        price: cur[1] as number,
      });

      return acc;
    }

    return data.prices.reduce(reducer, []);
  }

  // This is a custom token
  const token = await prisma.token.findUnique({
    where: {
      coingecko_id: tokenId,
    },
    select: {
      id: true,
      tokenHistory: {
        where: {
          createdAt: { gte: new Date(ONE_DAY_AGO) },
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          price: true,
          createdAt: true,
        },
      },
    },
  });

  if (!token) return [];

  const { tokenHistory } = token;

  if (tokenHistory.length < 8) return [undefined];

  function reducer(acc: ChartTokenData, cur: TokenHistory) {
    const date = new Date(cur.createdAt);
    const formatDate = formatTime(date);

    acc.push({
      date: formatDate,
      price: cur.price,
    });

    return acc;
  }

  return tokenHistory.reduce(reducer, []);
};
