import { type PrismaClient, TransactionType } from "@prisma/client";

export const weeklyWithdraws = async (prisma: PrismaClient) => {
  const data = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      type: TransactionType.WITHDRAW,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    _sum: {
      amount: true,
    },
  });

  return data[0]?._sum.amount ?? 0;
};
