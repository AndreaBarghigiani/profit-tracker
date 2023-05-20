import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

type CoinrankingTokenInfo = {
  uuid: string;
  symbol: string;
  name: string;
  color: string;
  iconUrl?: string;
  marketCap: string;
  price: string;
  listedAt: number;
  tier: number;
  change: string;
  rank: number;
  sparkline: string[];
  lowVolume: boolean;
  coinrankingUrl: string;
  "24hVolume": string;
  btcPrice: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  const options = {
    "x-access-token": process.env.COINRANK_API_KEY || "",
  };

  if (!options["x-access-token"]) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const result = await fetch(
    "https://api.coinranking.com/v2/coins?tier=1&limit=5000&offset=0",
    {
      method: "GET",
      headers: options,
    }
  );

  const {
    data: { coins },
  } = (await result.json()) as { data: { coins: CoinrankingTokenInfo[] } };

  const massaged = coins.map((coin) => ({
    symbol: coin.symbol,
    name: coin.name,
    iconUrl: coin.iconUrl,
    coinranking_uuid: coin.uuid,
    latestPrice: coin.price,
  }));

  try {
    await prisma.token.createMany({ data: massaged });
    res.status(200).json({ message: "ok" });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);
      res.status(httpStatusCode).json({ message: cause.message });
      return;
    }
    res.status(500).json({
      error: { message: `Something has gone wrong` },
    });
  }
}
