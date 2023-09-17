import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenByCoingeckoId } from "@/server/api/routers/token";
import { prisma } from "@/server/db";

export default async function tokenHistory(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query as { tokenId: string; userId: string };
  const { tokenId, userId } = query;

  try {
    const { id } = await getTokenByCoingeckoId({
      tokenId,
      prisma,
    });

    const hodls = await prisma.hodl.findMany({
      where: {
        tokenId: id,
        userId,
      },
    });

    console.log("hodls:", hodls);

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
