// Utils
import { z } from "zod";
import { Frequency } from "@prisma/client";

// Types
import { type Token, TransactionType } from "@prisma/client";

// Wallet types

export const WalletSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastInterestAccrued: z.date(),
  dailyProfit: z.number(),
  liquidFunds: z.number(),
  exposure: z.number(),
  totalDeposit: z.number(), // Think this will be removed
  profits: z.number(),
  userId: z.string(),
});

// Projects types
export const ProjectValuesSchema = z.object({
  name: z.string(),
  description: z.string(),
  deposit: z.number(),
  increaseFrequency: z.nativeEnum(Frequency),
  increaseAmount: z.number(),
  compound: z.boolean(),
  type: z.string().default("project"),
});

export type ProjectValues = z.infer<typeof ProjectValuesSchema>;

export const EditProjectValuesSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  increaseFrequency: z.nativeEnum(Frequency),
  increaseAmount: z.number(),
  compound: z.boolean(),
});

export type EditProjectValues = z.infer<typeof EditProjectValuesSchema>;

export const ProjectTransactionSchema = z.object({
  amount: z.number(),
  evaluation: z.number(),
  type: z.nativeEnum(TransactionType),
  projectId: z.string(),
});

export type ProjectTransaction = z.infer<typeof ProjectTransactionSchema>;

// Token types
export type UpdateTokenData = {
  coingecko_id: string;
  icon_url?: string;
  latestPrice: string;
};

// Transactions types
export const TransactionValuesSchema = z.object({
  amount: z.number(),
  evaluation: z.number(),
  type: z.nativeEnum(TransactionType),
  projectId: z.string().nullish(),
  hodlId: z.string().nullish(),
  tokenId: z.string().nullish(),
});

export type TransactionValues = z.infer<typeof TransactionValuesSchema>;

export type SumTxItem = {
  type: TransactionType;
  _sum: {
    evaluation: number | null;
    deposit?: number | null;
    amount: number | null;
    profits?: number | null;
  };
};

export type SumTxItemValued = {
  type: TransactionType;
  _sum: {
    evaluation: number;
    deposit?: number;
    amount: number;
    profits?: number;
  };
};

export type MassagedSumTxItem = {
  type: TransactionType;
  evaluation: number;
  deposit?: number;
  amount: number;
  profits?: number;
};

// Hodl types
export const HodlValuesSchema = z.object({
  currentAmount: z.number(),
  currentEvaluation: z.number(),
  totalInvested: z.number(),
  tokenId: z.string(),
});

export type HodlValues = z.infer<typeof HodlValuesSchema>;

export type TokenWithoutDates = Partial<
  Pick<Token, "createdAt" | "updatedAt">
> &
  Omit<Token, "createdAt" | "updatedAt">;

// CoinGecko
export const CoinGeckoCoinsMarketSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  image: z.string().transform((val) => {
    return val.startsWith("https") ? val : "/placeholder.png";
  }),
  current_price: z
    .number()
    .min(0)
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  market_cap: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  market_cap_rank: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  fully_diluted_valuation: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  total_volume: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  high_24h: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  low_24h: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  price_change_24h: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  price_change_percentage_24h: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  market_cap_change_24h: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  market_cap_change_percentage_24h: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  circulating_supply: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  total_supply: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  max_supply: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  ath: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  ath_change_percentage: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  atl: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
  atl_change_percentage: z
    .number()
    .nullable()
    .default(0)
    .transform((val) => {
      return val ?? 0;
    }),
});

export type CoinGeckoCoinsMarkets = z.infer<typeof CoinGeckoCoinsMarketSchema>;
