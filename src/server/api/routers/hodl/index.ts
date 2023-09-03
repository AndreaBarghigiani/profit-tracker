// Utils
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { HodlTransactionSchema } from "@/server/types";
import { getWallet } from "../wallet";
import { getTokenByCoingeckoId } from "../token";

// Types
import { type PrismaClient, TransactionType } from "@prisma/client";
import type { Session } from "next-auth";
import type {
  HodlTransaction,
  CalcDiffs,
  HodlDeleteTransaction,
  PrismaHodlTransaction,
} from "@/server/types";

export const getHodl = async ({
  hodlId,
  prisma,
}: {
  hodlId: string;
  prisma: PrismaClient;
}) => {
  return await prisma.hodl.findUniqueOrThrow({
    where: {
      id: hodlId,
    },
    include: {
      token: true,
    },
  });
};

export const getHodlByTokenId = async ({
  cgId,
  userId,
  prisma,
}: {
  cgId: string;
  userId: string;
  prisma: PrismaClient;
}) => {
  const { id: tokenId } = await getTokenByCoingeckoId({
    tokenId: cgId,
    prisma,
  });

  return await prisma.hodl.findUnique({
    where: {
      userId_tokenId: {
        tokenId,
        userId,
      },
    },
    include: {
      token: true,
    },
  });
};

export const isUserExposed = async ({
  ctx,
  input,
}: {
  ctx: { prisma: PrismaClient; session: Session };
  input: HodlTransaction;
}) => {
  return await ctx.prisma.hodl.findFirst({
    where: {
      userId: ctx.session.user.id,
      id: input.hodlId,
      exposure: {
        gt: 0,
      },
    },
  });
};

export const getDiffFromBuyes = async ({
  ctx,
  input,
}: {
  ctx: { prisma: PrismaClient; session: Session };
  input: CalcDiffs;
}) => {
  const airdrops_buys = await ctx.prisma.hodl.findUniqueOrThrow({
    where: {
      id: input.hodlId,
    },
    select: {
      token: {
        select: {
          id: true,
        },
      },
      transaction: {
        where: {
          type: { in: [TransactionType.AIRDROP, TransactionType.BUY] },
        },
        select: {
          amount: true,
          evaluation: true,
          type: true,
        },
      },
    },
  });

  const tots = airdrops_buys.transaction.reduce(
    (acc, curr) => {
      if (curr.type === TransactionType.BUY) {
        acc.buys += curr.evaluation;
      } else if (curr.type === TransactionType.AIRDROP) {
        acc.airdrops += curr.evaluation;
      }
      acc.tokens += curr.amount;
      return acc;
    },
    { buys: 0, airdrops: 0, tokens: 0 },
  );

  const average = tots.buys / tots.tokens;
  const currentHodlValue = input.hodlAmount * input.tokenLatestPrice;
  const averagedHodlValue = input.hodlAmount * average;

  return {
    tokenId: airdrops_buys.token.id,
    average,
    diff: currentHodlValue - averagedHodlValue,
    percentage:
      ((currentHodlValue - averagedHodlValue) / averagedHodlValue) * 100,
    positive: currentHodlValue > averagedHodlValue,
  };
};

export const getByCurrentUser = async ({
  ctx,
}: {
  ctx: { prisma: PrismaClient; session: Session };
}) => {
  return await ctx.prisma.hodl.findMany({
    where: {
      userId: ctx.session.user.id,
      status: "active",
    },
    include: {
      token: true,
    },
  });
};

const makeBuy = async ({
  ctx,
  input,
}: {
  ctx: { prisma: PrismaClient; session: Session };
  input: HodlTransaction;
}) => {
  const transactionType = input.airdrop
    ? (TransactionType.AIRDROP as "AIRDROP")
    : (TransactionType.BUY as "BUY");

  await ctx.prisma.hodl.update({
    where: {
      id: input.hodlId,
    },
    data: {
      amount: {
        increment: input.amount,
      },
      exposure: {
        increment: input.airdrop ? 0 : input.evaluation,
      },
      status: "active",
      transaction: {
        create: {
          type: transactionType,
          amount: input.amount,
          evaluation: input.evaluation,
        },
      },
    },
  });
};

const makeSell = async ({
  ctx,
  input,
}: {
  ctx: { prisma: PrismaClient; session: Session };
  input: HodlTransaction;
}) => {
  const isExposed = await isUserExposed({ ctx, input });

  const diff = !!isExposed
    ? input.evaluation - isExposed.exposure
    : input.evaluation;

  const exposure = diff >= 0 ? 0 : { decrement: input.evaluation };

  const profits =
    diff >= 0
      ? !isExposed
        ? { increment: input.evaluation }
        : { increment: diff }
      : isExposed?.profits;

  const transaction = {
    create: {
      type: TransactionType.SELL,
      amount: input.amount,
      evaluation: input.evaluation,
    },
  };

  const hodl = {
    update: [
      {
        where: {
          id: input.hodlId,
        },
        data: {
          amount: {
            decrement: input.amount,
          },
          status: input.status,
          exposure,
          profits,
          transaction,
        },
      },
    ],
  };

  await ctx.prisma.wallet.update({
    where: {
      userId: ctx.session.user.id,
    },
    data: {
      liquidFunds: {
        increment: input.evaluation,
      },
      hodl,
    },
  });
  // When I sell a token I need to:
  // 1. subtract the evaluation from the exposure of said token
  // 2. add the evaluation to the liquidFunds of the wallet
  // 3. check if the exposure of the token is 0, if so delete the token from the wallet
};

export const hodlRouter = createTRPCRouter({
  create: protectedProcedure
    .input(HodlTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.tokenId) return;

      const walletId = (
        await getWallet({ userId: ctx.session.user.id, prisma: ctx.prisma })
      ).id;

      const transactionType = input.airdrop
        ? (TransactionType.AIRDROP as "AIRDROP")
        : (TransactionType.BUY as "BUY");

      const position = await ctx.prisma.hodl.create({
        data: {
          amount: input.amount,
          exposure: input.airdrop ? 0 : input.evaluation,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          wallet: {
            connect: {
              id: walletId,
            },
          },
          token: {
            connect: {
              coingecko_id: input.tokenId,
            },
          },
          transaction: {
            create: {
              type: transactionType,
              amount: input.amount,
              evaluation: input.evaluation,
            },
          },
        },
      });

      // Update the token to make it trackable
      await ctx.prisma.token.update({
        where: {
          coingecko_id: input.tokenId,
        },
        data: {
          tracked: true,
        },
      });

      // Remove the liquid funds from the wallet
      if (input.useLiquidFunds) {
        await ctx.prisma.wallet.update({
          where: {
            id: walletId,
          },
          data: {
            liquidFunds: {
              decrement: input.evaluation,
            },
          },
        });
      }

      return position;
    }),
  transaction: protectedProcedure
    .input(HodlTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      switch (input.type) {
        case TransactionType.BUY:
          await makeBuy({ ctx, input });
          break;
        case TransactionType.SELL:
          await makeSell({ ctx, input });
          break;
      }
      return input.hodlId;
    }),
  get: protectedProcedure
    .input(z.object({ hodlId: z.string() }))
    .query(({ ctx, input }) => {
      return getHodl({ hodlId: input.hodlId, prisma: ctx.prisma });
    }),
  getByTokenId: protectedProcedure
    .input(z.object({ tokenId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.tokenId) return;

      return await ctx.prisma.hodl.findUnique({
        where: {
          userId_tokenId: {
            tokenId: input.tokenId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
  getByCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return await getByCurrentUser({ ctx });
  }),
  getTransactions: protectedProcedure
    .input(z.object({ hodlId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (await ctx.prisma.transaction.findMany({
        where: {
          hodlId: input.hodlId,
        },
        orderBy: {
          createdAt: "desc",
        },
      })) as PrismaHodlTransaction[];
    }),
  getDiffFromBuyes: protectedProcedure
    .input(
      z.object({
        hodlId: z.string(),
        hodlAmount: z.number(),
        tokenLatestPrice: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await getDiffFromBuyes({ ctx, input });
    }),
  getCardData: protectedProcedure
    .input(z.object({ hodlId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.hodl.findUniqueOrThrow({
        where: {
          id: input.hodlId,
        },
        include: {
          token: true,
        },
      });
    }),
  deleteTransaction: protectedProcedure
    .input(
      z.object({
        hodlId: z.string(),
        transactionId: z.string(),
        transactionAmount: z.number(),
        transactionEvaluation: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Don't need to touch the wallet, the Exposure is calculated on the fly
      await ctx.prisma.hodl.update({
        where: {
          id: input.hodlId,
        },
        data: {
          amount: {
            decrement: input.transactionAmount,
          },
          exposure: {
            decrement: input.transactionEvaluation,
          },
          transaction: {
            delete: {
              id: input.transactionId,
            },
          },
        },
      });
    }),
  // Right now it's the same as getByCurrentUser
  // list: protectedProcedure.query(({ ctx }) => {
  //   return ctx.prisma.hodl.findMany({
  //     where: {
  //       userId: ctx.session.user.id,
  //     },
  //     include: {
  //       token: true,
  //     },
  //   });
  // }),
  sellAll: protectedProcedure
    .input(
      z.object({ hodlId: z.string(), amount: z.number(), price: z.number() }),
    )
    .mutation(async ({ ctx, input }) => {
      const transaction = {
        type: TransactionType.SELL,
        amount: input.amount,
        evaluation: input.amount * input.price,
        hodlId: input.hodlId,
        status: "inactive" as const,
      };

      await makeSell({ ctx, input: transaction });
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.hodl.delete({
        where: {
          id: input,
        },
      });
    }),
});
