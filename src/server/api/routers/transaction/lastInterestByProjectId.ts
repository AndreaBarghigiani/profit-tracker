import {
  type PrismaClient,
  type Project,
  TransactionType,
} from "@prisma/client";

export const lastInterestByProjectId = async (
  project: Project,
  prisma: PrismaClient
) => {
  const lastTransaction = await prisma.transaction.findFirstOrThrow({
    where: {
      ...(project.accruing
        ? { type: TransactionType.INTEREST }
        : { type: TransactionType.DEPOSIT }),
      projectId: project.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log("calculating last");
  return lastTransaction;
};
