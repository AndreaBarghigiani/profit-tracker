import { type PrismaClient, TransactionType } from "@prisma/client";

export const lastInterestByProjectId = async (
  projectId: string,
  projectAccruing: boolean,
  prisma: PrismaClient
) => {
  const lastTransaction = await prisma.transaction.findFirstOrThrow({
    where: {
      ...(projectAccruing
        ? { type: TransactionType.INTEREST }
        : { type: TransactionType.DEPOSIT }),
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return lastTransaction;
};
