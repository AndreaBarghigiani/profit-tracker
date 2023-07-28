// Utils
import { calcAverage } from "@/utils/number";

// Types
import type { DexSearch } from "@/server/types";
import type { Hodl, Token } from "@prisma/client";

type PositionsProps = (Hodl & { token: Token })[];

export const sortedPositions = (positions: PositionsProps): PositionsProps => {
  positions.sort(
    (a, b) => b.amount * b.token.latestPrice - a.amount * a.token.latestPrice,
  );

  return positions;
};

export const formatDexPairAsToken = (data: DexSearch) => {
  const { pairs } = data;

  const tokenPrices = pairs.map((pair) => Number(pair.priceUsd));
  const tokenChanges = pairs.map((pair) => Number(pair.priceChange.h24));
  const tokenPriceAvg = calcAverage(tokenPrices);
  const tokenChangeeAvg = calcAverage(tokenChanges);
  const baseData = pairs.pop();

  if (!baseData) throw new Error("No base data found");

  return {
    symbol: baseData.baseToken.symbol,
    name: baseData.baseToken.name,
    coingecko_id: `custom-${baseData.baseToken.address}`,
    latestPrice: tokenPriceAvg,
    change24h: tokenChangeeAvg,
    custom: true,
    platforms: {
      [baseData.chainId]: baseData.baseToken.address,
    },
  };
};
