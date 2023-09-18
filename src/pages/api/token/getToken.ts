// Utils
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { prisma } from "@/server/db";

// Types
import type { NextApiRequest, NextApiResponse } from "next";
import { ParseGetTokenSchema } from "@/server/types";

export default async function getToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = ParseGetTokenSchema.safeParse(req.query);
  console.log("hello", result);

  if (!result.success) {
    return res.status(400).json({
      error: "Missing something, I'll improve the error message later",
    });
  }

  const { tokenId: id } = result.data;
  try {
    const token = await prisma.token.findMany({
      where: {
        AND: [{ tracked: true }, { coingecko_id: id }],
      },
    });

    res.status(200).json({ message: "ok", token });
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
