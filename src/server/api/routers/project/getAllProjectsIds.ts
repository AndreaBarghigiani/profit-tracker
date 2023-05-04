import { type PrismaClient } from "@prisma/client";

export const getAllProjectsIds = async ({ prisma }: { prisma: PrismaClient }) => {
	return await prisma.project.findMany({
		select: {
			id: true,
		}
	});
};
