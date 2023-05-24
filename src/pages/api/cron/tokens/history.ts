import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, TokenHistory } from "@prisma/client";

type TokenHistoryData = {
  price: string;
  timestamp: number;
};

export default async function tokenHistory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tokenId: string =
    typeof req.query?.uuid === "string" ? req.query.uuid : "Qwsogvtv82FCd"; // Defaults to BTC
  const prisma = new PrismaClient();
  const options = {
    "x-access-token": process.env.COINRANK_API_KEY || "",
  };

  if (!options["x-access-token"]) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  //
  const result = await fetch(
    `https://api.coinranking.com/v2/coin/${tokenId}/history?timePeriod=5y`,
    {
      method: "GET",
      headers: options,
    }
  );

  const {
    data: { history },
  } = (await result.json()) as { data: { history: TokenHistoryData[] } };

  const historyObj = history
    .filter((entry) => !!entry.price)
    .map((entry) => {
      const calcDate = new Date(entry.timestamp * 1000);
      return {
        tokenId,
        price: entry.price,
        createdAt: calcDate,
      };
    });

  try {
    // await prisma.tokenHistory.create({ data: historyObj[0] });
    await prisma.tokenHistory.createMany({ data: historyObj });
    res.status(200).json({ message: "ok" });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);
      res.status(httpStatusCode).json({ message: cause.message });
      return;
    }
    // console.log("cause", cause?.message);
    res.status(500).json({
      error: { message: "Something wrong" },
    });
  }
}
