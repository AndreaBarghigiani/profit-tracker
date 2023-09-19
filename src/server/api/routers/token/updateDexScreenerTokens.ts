// Utils
import { formatDexPairAsToken } from "@/utils/positions";
import { prisma } from "@/server/db";
import { HALF_HOUR } from "@/utils/number";

// Types
import type { DexScreenerPair } from "@/server/types";
import { DexSearchSchema } from "@/server/types";

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
      AND: [
        {
          updatedAt: {
            lte: new Date(HALF_HOUR),
          },
        },
      ],
    },
  });

  const customAddresses = tokensToUpdate.map((token) =>
    encodeURIComponent(token.coingecko_id.replace("custom-", "")),
  );

  if (!customAddresses.length) return [];

  const DexScreenerUrl = new URL(
    `https://api.dexscreener.com/latest/dex/tokens/${customAddresses.join(
      ",",
    )}`,
  );

  const DexScreenerResponse = await fetch(DexScreenerUrl);
  const { pairs } = DexSearchSchema.parse(await DexScreenerResponse.json());

  const grouped = pairs.reduce((acc, pair) => {
    const {
      baseToken: { address },
    } = pair;

    if (!customAddresses.includes(address)) return acc;

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

  return averaged;
};
