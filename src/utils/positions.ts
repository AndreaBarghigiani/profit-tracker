// Utils
import { api } from "@/utils/api";
import { calcAverage } from "@/utils/number";

// Types
import type {
  DexScreenerPair,
  UpdateTokenData,
  FullPositionZod,
} from "@/server/types";

export const sortedPositionsByPrice = (
  positions: FullPositionZod[],
): FullPositionZod[] => {
  positions.sort(
    (a, b) => b.amount * b.token.latestPrice - a.amount * a.token.latestPrice,
  );

  return positions;
};

/*
 * This function takes an array of DexScreenerPair objects and returns a single
 * UpdateTokenData object. The DexScreenerPair objects are the result of a
 * search query to the DexScreener API. The UpdateTokenData object is the
 * result of formatting the DexScreenerPair objects into a single object that
 * can be used to update the database.
 *
 */
export const formatDexPairAsToken = (
  pairs: DexScreenerPair[],
): UpdateTokenData => {
  const tokenPrices = pairs.map((pair) => Number(pair.priceUsd));
  const tokenChanges = pairs.map((pair) => Number(pair.priceChange.h24));
  const tokenPriceAvg = calcAverage(tokenPrices);
  const tokenChangeAvg = calcAverage(tokenChanges);
  const baseData = pairs.pop();

  if (!baseData) throw new Error("No base data found");

  return {
    symbol: baseData.baseToken.symbol,
    name: baseData.baseToken.name,
    coingecko_id: `custom-${baseData.baseToken.address}`,
    latestPrice: tokenPriceAvg,
    change24h: tokenChangeAvg,
    custom: true,
    platforms: {
      [baseData.chainId]: baseData.baseToken.address,
    },
  };
};

export const hodlSummary = (hodls: FullPositionZod[]) => {
  const total = hodls.reduce((acc, position) => {
    return (acc += position.amount * position.token.latestPrice);
  }, 0);

  const diffs = hodls.map((position) => {
    const { data: hodlDiff } = api.hodl.getDiffFromBuyes.useQuery(
      {
        hodlId: position.id,
        hodlAmount: position.amount,
        tokenLatestPrice: position.token.latestPrice,
      },
      {
        refetchOnWindowFocus: false,
      },
    );

    return hodlDiff;
  });

  const topPerformer = diffs.reduce(
    (acc, diff) => {
      if (!diff) return acc;

      return Number(diff.percentage) > Number(acc.percentage) ? diff : acc;
    },
    { tokenId: "", percentage: "0" },
  );

  const reduced = diffs.reduce((acc, diff) => {
    if (!diff) return acc;

    return (acc += Number(diff.percentage));
  }, 0);

  return {
    total,
    change: reduced,
    topPerformer,
  };
};
