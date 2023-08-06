import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateMarketData } from "@/server/api/routers/token/updateMarketData";

export default async function tokenHistory(
  req: NextApiRequest,
  res: NextApiResponse,
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

  // const customSample = [
  //   "arbitrum",
  //   "custom-0x3b248cefa87f836a4e6f6d6c9b42991b88dc1d58",
  //   "custom-0x29abc4d03d133d8fd1f1c54318428353ce08727e",
  //   "custom-0x6c997a37f5a1dca62b58eeb01041f056942966b3",
  // ];

  try {
    await updateMarketData({
      tokenIds: sample,
    });

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
