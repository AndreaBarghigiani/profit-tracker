import { type PrismaClient, TransactionType } from "@prisma/client";

export const lastInterestByProjectId = async (
  projectId: string,
  prisma: PrismaClient
) => {
  const lastTransaction = await prisma.transaction.findFirst({
    where: {
      OR: [
        { type: TransactionType.INTEREST },
        { type: TransactionType.DEPOSIT },
      ],
      AND: { projectId },
    },
    orderBy: {
      createdAt: TransactionType.INTEREST ? "desc" : "asc",
    },
  });

  return lastTransaction;
};
