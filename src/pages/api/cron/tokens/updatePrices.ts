// Utils
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { prisma } from "@/server/db";
import { updateMarketData } from "@/server/api/routers/token/updateMarketData";
import { HALF_HOUR } from "@/utils/number";
import { log } from "next-axiom";

// Types
import type { NextApiRequest, NextApiResponse } from "next";

export default async function tokenHistory(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const tokens = await prisma.token.findMany({
      where: {
        AND: [
          { tracked: true },
          {
            updatedAt: {
              lte: new Date(HALF_HOUR),
            },
          },
        ],
      },
      select: {
        coingecko_id: true,
      },
    });

    const tokenIds: string[] = tokens.map((token) => token.coingecko_id);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    log.debug("tokensIds", { tokenIds });

    // Send updatePrices request only if there are tokens to update
    if (tokenIds.length > 0) {
      await updateMarketData({ tokenIds });
    }

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
