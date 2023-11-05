// Utils
import { z } from "zod";
import { Frequency, TransactionType } from "@prisma/client";

// Types
import type { Token, Hodl } from "@prisma/client";
import type { Column } from "@tanstack/react-table";
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

export const TransactionRowValuesSchema = z.object({
  id: z.string(),
  createdAt: z.object({
    date: z.string(),
    time: z.string(),
  }),
  eval: z.object({
    amount: z.number(),
    evaluation: z.number(),
  }),
  token: z.object({
    name: z.string(),
    price: z.number(),
  }),
  type: z.nativeEnum(TransactionType),
  useLiquidFunds: z.boolean().optional(),
});

export type TransactionRowValues = z.infer<typeof TransactionRowValuesSchema>;

export const PrismaTransactionSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  amount: z.number(),
  evaluation: z.number(),
  type: z.nativeEnum(TransactionType),
  projectId: z.string().optional(),
  hodlId: z.string().optional(),
});

export const PrismaHodlTransactionSchema = PrismaTransactionSchema.extend({
  hodlId: z.string(),
});

export type PrismaHodlTransaction = z.infer<typeof PrismaHodlTransactionSchema>;

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
  airdrop: z.boolean().optional(),
  status: z
    .union([z.literal("active"), z.literal("inactive")])
    .default("active"),
});

export type HodlTransaction = z.infer<typeof HodlTransactionSchema>;

export const HodlDeleteTransactionSchema = TransactionValuesSchema.extend({
  hodlId: z.string(),
  id: z.string(),
  createdAt: z.date(),
});

export type HodlDeleteTransaction = z.infer<typeof HodlDeleteTransactionSchema>;

export const DcaStrategyStep = z.object({
  percentage: z.number().positive().max(100),
  price: z.number().positive(),
});

export const DcaStrategySchema = z.object({
  hodlId: z.string(),
  steps: z.array(DcaStrategyStep),
});

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
export const PlatformsSchema = z.record(z.string(), z.string());
export const ParseGetTokenSchema = z.object({ tokenId: z.string() });

export type Platforms = z.infer<typeof PlatformsSchema>;

export const TokenSchema = z.object({
  id: z.string(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  symbol: z.string(),
  name: z.string(),
  iconUrl: z.string().nullable(),
  latestPrice: z.number(),
  change24h: z.number(),
  coingecko_id: z.string(),
  platforms: PlatformsSchema.optional(),
  tracked: z.boolean(),
  custom: z.boolean(),
});

export type TokenZod = z.infer<typeof TokenSchema>;

export const TokenHistorySchema = z.object({
  createdAt: z.date().or(z.string()),
  price: z.number(),
});

export type TokenHistory = z.infer<typeof TokenHistorySchema>;

export const FullPositionSchema = z.object({
  id: z.string(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  amount: z.number(),
  exposure: z.number(),
  profits: z.number(),
  status: z.string(),
  tokenId: z.string(),
  userId: z.string(),
  walletId: z.string(),
  token: TokenSchema,
});

export type FullPositionZod = z.infer<typeof FullPositionSchema>;

export type FullPosition = Hodl & { token: Token };

export const CalcDiffsSchema = z.object({
  hodlId: z.string(),
  hodlAmount: z.number(),
  tokenLatestPrice: z.number(),
});

export const HodlPositionFormSchema = z
  .object({
    hodlId: z.string().nullable().optional(),
    hodlAmount: z.number().nullable().optional(),
  })
  .nullable()
  .optional();

export type HodlPositionForm = z.infer<typeof HodlPositionFormSchema>;

export type CalcDiffs = z.infer<typeof CalcDiffsSchema>;

export type UpdateTokenData = {
  coingecko_id: string;
  symbol: string;
  name: string;
  custom?: boolean;
  platforms?: object;
  icon_url?: string;
  latestPrice: number;
  change24h: number;
};

export const ChartTokenDataSchema = z.array(
  z.object({ date: z.string(), price: z.number() }),
);

export type ChartTokenData = z.infer<typeof ChartTokenDataSchema>;

export const TokenWithoutDatesSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  iconUrl: z.string().nullable(),
  latestPrice: z.number(),
  change24h: z.number(),
  coingecko_id: z.string(),
  platforms: PlatformsSchema.optional(),
  custom: z.boolean().optional(),
});

export type TokenWithoutDatesZod = z.infer<typeof TokenWithoutDatesSchema>;

export type TokenWithoutDates = Partial<
  Pick<Token, "createdAt" | "updatedAt">
> &
  Omit<Token, "createdAt" | "updatedAt">;

// Emails
export const feedbackSchema = z.object({
  email: z.string().email(),
  username: z.string().nonempty(),
  message: z.string().nonempty(),
  rating: z.number().min(1).max(5).optional(),
  image: z.string().url().optional(),
});

export type feedbackProps = z.infer<typeof feedbackSchema>;

// User
export type UserCache = {
  modals: {
    [key: string]: boolean;
  };
  preferences?: {
    [key: string]: string;
  };
};

// Data Tables
export interface DataTableTxFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export interface DataTableRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    amount: [number, number];
    evaluation: [number, number];
    price: [number, number];
  };
}
