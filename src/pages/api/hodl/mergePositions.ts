import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";

type DuplicateHodl = {
  tokenId: string;
  userId: string;
  oldestCreatedAt: Date;
};

type DuplicateHodls = DuplicateHodl[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Find all
    // const duplicateHodls = await prisma.hodl.groupBy({
    //   by: ["tokenId", "userId"],
    //   // having: { _count: { gt: 1 } },
    // 	orderBy: [{ tokenId: "asc" }, { userId: "asc" }],

    //   // select: { tokenId: true, userId: true, createdAt: { min: true } },
    // });
    const duplicateHodls: DuplicateHodls = await prisma.$queryRaw`
  SELECT "tokenId", "userId", MIN("createdAt") as "oldestCreatedAt"
  FROM "Hodl"
  GROUP BY "tokenId", "userId"
  HAVING COUNT(*) > 1
`;
    let oldestHodl;
    let otherHodls;
    for (const duplicate of duplicateHodls) {
      oldestHodl = await prisma.hodl.findFirst({
        where: {
          tokenId: duplicate.tokenId,
          userId: duplicate.userId,
          createdAt: duplicate.oldestCreatedAt,
        },
      });

      if (!oldestHodl)
        return res.status(500).json({ message: "oldestHodl not found" });

      otherHodls = await prisma.hodl.findMany({
        where: {
          tokenId: duplicate.tokenId,
          userId: duplicate.userId,
          id: {
            not: oldestHodl.id,
          },
        },
      });
      console.log("otherHodls:", otherHodls);

      for (const hodl of otherHodls) {
        await prisma.transaction.updateMany({
          where: {
            hodlId: hodl.id,
          },
          data: {
            hodlId: oldestHodl.id,
          },
        });

        await prisma.hodl.delete({
          where: {
            id: hodl.id,
          },
        });

        // sum all the new transactions
        const newTransactions = await prisma.transaction.aggregate({
          _sum: {
            amount: true,
            evaluation: true,
          },
          where: {
            hodlId: oldestHodl.id,
          },
        });

        await prisma.hodl.update({
          where: {
            id: oldestHodl.id,
          },
          data: {
            amount: newTransactions._sum.amount ?? 0,
            exposure: newTransactions._sum.evaluation ?? 0,
          },
        });
      }
    }
    res.status(200).json({ message: "ok, now check the dashboard" });
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
