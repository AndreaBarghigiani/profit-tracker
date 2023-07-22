import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";

// Types
import type { CoinGeckoTokenInfo } from "@/server/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await fetch(
    `https://api.coingecko.com/api/v3/coins/list?include_platform=true`,
  );

  const data = (await result.json()) as CoinGeckoTokenInfo[];

  const massaged = data.map((coin) => ({
    symbol: coin.symbol,
    name: coin.name,
    coingecko_id: coin.id,
    platforms: coin.platforms,
  }));

  try {
    await prisma.token.createMany({ data: massaged, skipDuplicates: true });
    res.status(200).json({ message: "ok", data, massaged });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);
      res.status(httpStatusCode).json({ message: cause.message });
      return;
    }

    res.status(500).json({
      error: { message: `Something has gone wrong`, cause },
    });
  }
}
