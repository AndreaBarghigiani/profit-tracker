import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { ensureAllTransactionTypes } from "../transaction/sumTransactions";

// Types
import { TransactionType } from "@prisma/client";
import { EditProjectValuesSchema, ProjectValuesSchema } from "@/server/types";

import type { PrismaClient } from "@prisma/client";

export const getProject = async ({
  projectId,
  prisma,
}: {
  projectId: string;
  prisma: PrismaClient;
}) => {
  const project = await prisma.project.findUniqueOrThrow({
    where: {
      id: projectId,
    },
  });

  return project;
};

export const projectRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany();
  }),
  get: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return getProject({ projectId: input.projectId, prisma: ctx.prisma });
    }),
  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findMany({
        where: {
          userId: input.userId,
        },
      });
    }),
  getByCurrentUser: protectedProcedure
    .input(
      z
        .object({ orderBy: z.union([z.literal("asc"), z.literal("desc")]) })
        .optional()
    )
    .query(({ ctx, input }) => {
      const orderBy = input?.orderBy ? input.orderBy : "asc";

      return ctx.prisma.project.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: [
          {
            name: orderBy,
          },
        ],
      });
    }),
  update: protectedProcedure
    .input(EditProjectValuesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
  create: protectedProcedure
    .input(ProjectValuesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.wallet.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          exposure: {
            increment: input.deposit,
          },
          totalDeposit: {
            increment: input.deposit,
          },
          project: {
            create: {
              ...input,
              exposure: input.deposit,
              deposit: input.deposit,
              userId: ctx.session.user.id,
              transaction: {
                create: {
                  type: TransactionType.DEPOSIT,
                  amount: input.deposit,
                  evaluation: input.deposit,
                },
              },
            },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const allProjectTx = await ctx.prisma.transaction.groupBy({
        by: ["type"],
        where: {
          project: {
            id: input,
          },
        },
        _sum: {
          amount: true,
          evaluation: true,
        },
      });

      const sortList = ["WITHDRAW", "DEPOSIT", "INTEREST"];

      const ordered = ensureAllTransactionTypes(allProjectTx).sort(
        (a, b) => sortList.indexOf(a.type) - sortList.indexOf(b.type)
      );

      const removeFromWallet = ordered.reduce(
        (acc, cur) =>
          cur.type === "WITHDRAW"
            ? acc - cur._sum.evaluation
            : acc + cur._sum.evaluation,
        0
      );

      await ctx.prisma.wallet.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          total: {
            decrement: removeFromWallet,
          },
          totalDeposit: {
            decrement: removeFromWallet,
          },
        },
      });

      await ctx.prisma.project.delete({
        where: {
          id: input,
        },
      });
    }),
});
