// Utils
import { lastInterestByProjectId } from "./lastInterestByProjectId";
import { type PrismaClient, TransactionType, Frequency } from "@prisma/client";
import { getProject } from "../project";

const mapFrequency: Record<string, number> = {
  // All following will be slightly off due to cron settings
  [Frequency.HOURLY]: 59 * 60 * 1000, // 1 hours in milliseconds
  [Frequency.DAILY]: 23 * 60 * 60 * 1000, // 24 hours in milliseconds
  [Frequency.WEEKLY]: 7 * 23 * 60 * 60 * 1000, // 7 days in milliseconds
  [Frequency.MONTLY]: 30 * 23 * 60 * 60 * 1000, // 30 days in milliseconds
  [Frequency.YEARLY]: 365 * 23 * 60 * 60 * 1000, // 365 days in milliseconds
};

export const addInterest = async (
  projectId: string,
  prisma: PrismaClient,
  skip: boolean
) => {
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

  if (timeDiff < projectFrequencyHours && !skip) return;

  // 1. calculate interest amount
  const amount: number = project.compound
    ? project.moneyAtWork * (project.increaseAmount / 100)
    : project.deposit * (project.increaseAmount / 100);

  // 2. update project currentHolding
  await prisma.project.update({
    where: {
      id: project.id,
    },
    data: {
      interest: {
        increment: amount,
      },
      // Indreases only if compounding
      ...(project.compound && {
        moneyAtWork: {
          increment: amount,
        },
      }),
      accruing: true,
      transaction: {
        create: {
          amount,
          evaluation: amount,
          type: TransactionType.INTEREST,
        },
      },
    },
  });

  return {
    projectId: project.id,
    amount,
  };
};
