// Utils
import { z } from "zod";
import { Frequency } from "@prisma/client";

// Types
import { TransactionType } from "@prisma/client";

// Projects types
export const ProjectValuesSchema = z.object({
  name: z.string(),
  description: z.string(),
  initial: z.number(),
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

// Transactions types
export const TransactionValuesSchema = z.object({
  amount: z.number(),
  evaluation: z.number().optional(),
  type: z.nativeEnum(TransactionType),
  projectId: z.string().nullish(),
  hodlId: z.string().nullish(),
});

export type TransactionValues = z.infer<typeof TransactionValuesSchema>;

export type SumTxItem = {
  type: TransactionType;
  _sum: {
    amount: number | null;
  };
};

export type SumTxItemValued = {
  type: TransactionType;
  _sum: {
    amount: number;
  };
};

export type MassagedSumTxItem = {
  type: TransactionType;
  amount: number;
};

// Hodl types
export const HodlValuesSchema = z.object({
  currentAmount: z.number(),
  currentEvaluation: z.number(),
  totalInvested: z.number(),
  tokenId: z.string(),
});

export type HodlValues = z.infer<typeof HodlValuesSchema>;

// CoinGecko
export type CoinGeckoCoinsMarkets = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null;
  last_updated: string;
};
