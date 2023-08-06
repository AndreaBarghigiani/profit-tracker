// Utils
import { formatDexPairAsToken } from "@/utils/positions";

// Types
import type { DexScreenerPair } from "@/server/types";
import { DexSearchSchema } from "@/server/types";

export const updateDexScreenerTokens = async ({
  dexScreenerTokens,
}: {
  dexScreenerTokens: string[];
}) => {
  const customAddresses = dexScreenerTokens
    .map((token) => token.replace("custom-", ""))
    .join(",");
  const DexScreenerUrl = new URL(
    `https://api.dexscreener.com/latest/dex/tokens/${customAddresses}`,
  );

  const DexScreenerResponse = await fetch(DexScreenerUrl);
  const { pairs } = DexSearchSchema.parse(await DexScreenerResponse.json());
  // const DexToken: UpdateTokenData = formatDexPairAsToken({ pairs });

  const grouped = pairs.reduce((acc, pair) => {
    const {
      baseToken: { address },
    } = pair;

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
