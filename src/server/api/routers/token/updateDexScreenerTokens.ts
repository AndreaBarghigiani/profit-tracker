// Utils
import { formatDexPairAsToken } from "@/utils/positions";
import { prisma } from "@/server/db";
import { chunkArray } from "@/utils/array";
import { log } from "next-axiom";

// Types
import type { DexScreenerPair } from "@/server/types";
import { DexSearchSchema } from "@/server/types";

const fetchTokensInChunks = async (
  tokens: string[],
  maxItemPerChunk: number,
) => {
  const chunks = chunkArray(tokens, maxItemPerChunk);

  const fetchedDataRequests = chunks.map(async (chunk) => {
    try {
      return await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${chunk.join(",")}`,
      );
    } catch (error) {
      console.log(error);
      return;
    }
  });

  const fetchedDataResponses = await Promise.all(fetchedDataRequests);
  const fetchedDataPromises = fetchedDataResponses.map((response) =>
    response !== undefined ? response.json() : {},
  );
  const fetchedData = await Promise.all(fetchedDataPromises);

  if (!fetchedData) return;

  return fetchedData.pop();
};

export const updateDexScreenerTokens = async ({
  dexScreenerTokens,
}: {
  dexScreenerTokens: string[];
}) => {
  const tokensToUpdate = await prisma.token.findMany({
    where: {
      coingecko_id: {
        in: dexScreenerTokens,
      },
    },
  });

  const customAddresses = tokensToUpdate.map((token) =>
    encodeURIComponent(token.coingecko_id.replace("custom-", "")),
  );

  if (!customAddresses.length) return [];

  const DexScreenerResponse = await fetchTokensInChunks(customAddresses, 30);

  if (DexScreenerResponse === undefined) return [];

  const { pairs } = DexSearchSchema.parse(DexScreenerResponse);

  const grouped = pairs.reduce((acc, pair) => {
    const {
      baseToken: { address },
    } = pair;

    if (!customAddresses.includes(encodeURIComponent(address))) return acc;

    if (!acc[address]) {
      acc[address] = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    acc[address].push(pair);

    return acc;
  }, {});

  const averaged = Object.keys(grouped).map((group) => {
    return formatDexPairAsToken(grouped[group] as DexScreenerPair[]);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  log.debug("updateDexScreenerTokens", {
    tokensToUpdate,
    customAddresses,
    grouped,
    averaged,
  });

  return averaged;
};
