import { type PrismaClient, TransactionType } from "@prisma/client";

import type { MassagedSumTxItem } from "@/server/types";

export const sumProjectInterests = async (
  projectId: string,
  prisma: PrismaClient
): Promise<MassagedSumTxItem> => {
  const sumTx = await prisma.transaction.aggregate({
    where: {
      type: "INTEREST",
      project: {
        id: projectId,
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
