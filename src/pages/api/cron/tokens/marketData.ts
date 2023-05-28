import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateMarketData } from "@/server/api/routers/token/updateMarketData";

export default async function tokenHistory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sample = [
    "bitcoin",
    "ethereum",
    "matic-network",
    "binancecoin",
    "cardano",
    "dogecoin",
    "avalanche-2",
    "cosmos",
    "arbitrum",
  ];

  try {
    const updatedData = await updateMarketData({
      tokenIds: sample,
    });
    console.log("updatedData:", updatedData);
    res.status(200).json({ message: "ok" });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);
      res.status(httpStatusCode).json({ message: cause.message });
      return;
    }
    res.status(500).json({
      error: { message: "Something wrong" },
    });
  }
}
