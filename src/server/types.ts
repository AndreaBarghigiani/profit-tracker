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
  type: z.nativeEnum(TransactionType),
  projectId: z.string(),
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
