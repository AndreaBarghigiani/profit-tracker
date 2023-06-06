// Utils
import { lastInterestByProjectId } from "./lastInterestByProjectId";
import { type PrismaClient, TransactionType } from "@prisma/client";
import { getProject } from "../project";

const mapFrequency: Record<string, number> = {
  DAILY: 23 * 60 * 60 * 1000, // 24 hours in milliseconds
  WEEKLY: 7 * 23 * 60 * 60 * 1000, // 7 days in milliseconds
  MONTHLY: 30 * 23 * 60 * 60 * 1000, // 30 days in milliseconds
  YEARLY: 365 * 23 * 60 * 60 * 1000, // 365 days in milliseconds
};

export const addInterest = async (projectId: string, prisma: PrismaClient) => {
  const project = await getProject({ projectId, prisma });

  const projectFrequencyHours = mapFrequency[
    project.increaseFrequency
  ] as number;
  const currentTime = new Date().getTime();

  const lastTransaction = await lastInterestByProjectId(
    project.id,
    project.accruing,
    prisma
  );

  const timeDiff = currentTime - lastTransaction.createdAt.getTime() - 1;

  if (timeDiff < projectFrequencyHours) return;

  // 1. calculate interest amount
  const amount: number = project.compound
    ? project.currentHolding * (project.increaseAmount / 100)
    : project.initial * (project.increaseAmount / 100);

  // 2. add new transaction with interest amount
  await prisma.transaction.create({
    data: {
      amount,
      evaluation: amount,
      projectId: project.id,
      type: TransactionType.INTEREST,
    },
  });

  // 3. update project currentHolding
  await prisma.project.update({
    where: {
      id: project.id,
    },
    data: {
      currentHolding: {
        increment: amount,
      },
      accruing: true,
    },
  });

  // 4. update wallet with new project holdings
  await prisma.wallet.update({
    where: {
      userId: project.userId,
    },
    data: {
      total: {
        increment: amount,
      },
    },
  });

  return {
    projectId: project.id,
    amount,
  };
};
