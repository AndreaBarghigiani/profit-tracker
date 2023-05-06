import { type PrismaClient } from "@prisma/client";
import { type Session } from "next-auth";

export const listAllProjectsIdsByCurrentUser = async ({
  session,
  prisma,
}: {
  session: Session;
  prisma: PrismaClient;
}) => {
  return await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });
};
