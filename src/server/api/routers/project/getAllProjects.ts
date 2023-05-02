import { type PrismaClient } from "@prisma/client";

export const getAllProjects = async ({ prisma }: { prisma: PrismaClient }) => {
  return await prisma.project.findMany();
};
