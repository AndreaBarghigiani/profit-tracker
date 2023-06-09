// Utils
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { prisma } from "@/server/db";
import { updatePrices } from "@/server/api/routers/token/updatePrices";

// Types
import type { NextApiRequest, NextApiResponse } from "next";

export default async function tokenHistory(
  _: NextApiRequest,
  res: NextApiResponse
) {
  const oneDay = Date.now() - 1000 * 60 * 60 * 24;

  try {
    const tokens = await prisma.token.findMany({
      where: {
        AND: [
          { tracked: true },
          {
            updatedAt: {
              lte: new Date(oneDay),
            },
          },
        ],
      },
      select: {
        coingecko_id: true,
      },
    });

    const tokenIds: string[] = tokens.map((token) => token.coingecko_id);

    await updatePrices({ tokenIds });

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
