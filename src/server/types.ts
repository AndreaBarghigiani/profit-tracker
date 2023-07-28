// Utils
import { z } from "zod";
import { Frequency, TransactionType } from "@prisma/client";

// Types
import type { Token, Hodl } from "@prisma/client";

// Wallet types

export const WalletSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  dailyProfit: z.number(),
  liquidFunds: z.number(),
  userId: z.string(),
});

// Transactions types
export const TransactionValuesSchema = z.object({
  amount: z.number(),
  evaluation: z.number(),
  type: z.nativeEnum(TransactionType),
  useLiquidFunds: z.boolean().optional(),
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

// Projects types
export const ProjectValuesSchema = z.object({
  name: z.string(),
  description: z.string(),
  deposit: z.number(),
  increaseFrequency: z.nativeEnum(Frequency),
  increaseAmount: z.number(),
  compound: z.boolean(),
  type: z.string().default("project"),
  useLiquidFunds: z.boolean().optional(),
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

export const ProjectTransactionSchema = TransactionValuesSchema.extend({
  projectId: z.string(),
});

export type ProjectTransaction = z.infer<typeof ProjectTransactionSchema>;

// Hodl types
export type HodlWithoutDates = Partial<Pick<Hodl, "createdAt" | "updatedAt">> &
  Omit<Hodl, "createdAt" | "updatedAt">;

export const HodlTransactionSchema = TransactionValuesSchema.extend({
  hodlId: z.string().optional(),
  tokenId: z.string().optional(),
  status: z
    .union([z.literal("active"), z.literal("inactive")])
    .default("active"),
});

export type HodlTransaction = z.infer<typeof HodlTransactionSchema>;

// CoinGecko
export const CoinGeckoTokenInfoSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  platforms: z.object({}).catchall(z.string()).optional(),
});

export type CoinGeckoTokenInfo = z.infer<typeof CoinGeckoTokenInfoSchema>;

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

export const CoinGeckoChartSchema = z.object({
  prices: z.array(z.array(z.number())),
  market_caps: z.array(z.array(z.number())),
  total_volumes: z.array(z.array(z.number())),
});

export type CoinGeckoChart = z.infer<typeof CoinGeckoChartSchema>;

export const CoinGeckoSearchSchema = z.object({
  id: z.string(),
  name: z.string(),
  api_symbol: z.string(),
  symbol: z.string(),
  market_cap_rank: z.number().nullable(),
  thumb: z.string(),
  large: z.string(),
});

export type CoinGeckoSearch = z.infer<typeof CoinGeckoSearchSchema>;

export const CoinGeckoSearchResponseSchema = z.object({
  coins: z.array(CoinGeckoSearchSchema).optional(),
});

export type CoinGeckoSearchResponse = z.infer<
  typeof CoinGeckoSearchResponseSchema
>;

// DexScreener
export const DexTokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export const DexScreenerPairSchema = z.object({
  chainId: z.string(),
  baseToken: DexTokenSchema,
  priceChange: z.object({
    m5: z.number(),
    h1: z.number(),
    h6: z.number(),
    h24: z.number(),
  }),
  priceUsd: z.string(),
});

export type DexScreenerPair = z.infer<typeof DexScreenerPairSchema>;

export const DexSearchSchema = z.object({
  pairs: z.array(DexScreenerPairSchema),
});

export type DexSearch = z.infer<typeof DexSearchSchema>;

// Token types
export type UpdateTokenData = {
  coingecko_id: string;
  icon_url?: string;
  latestPrice: number;
  change24h: number;
};

export type ChartTokenData = {
  index: Date[];
  prices: number[];
};

export type TokenWithoutDates = Partial<
  Pick<Token, "createdAt" | "updatedAt">
> &
  Omit<Token, "createdAt" | "updatedAt">;
