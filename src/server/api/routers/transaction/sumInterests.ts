import { type PrismaClient, TransactionType } from "@prisma/client";

import type { MassagedSumTxItem } from "@/server/types";

export const sumInterests = async (
  userId: string,
  prisma: PrismaClient
): Promise<MassagedSumTxItem> => {
  const sumTx = await prisma.transaction.aggregate({
    where: {
      type: "INTEREST",
      project: {
        userId,
      },
    },
    _sum: {
      amount: true,
      evaluation: true,
    },
  });

  return {
    type: TransactionType.INTEREST,
    amount: sumTx._sum.amount ?? 0,
    evaluation: sumTx._sum.evaluation ?? 0,
  };
};
