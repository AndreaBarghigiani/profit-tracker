import { z } from "zod";
import { Frequency } from "@prisma/client";

export const ProjectValuesSchema = z.object({
  name: z.string(),
  description: z.string(),
  initial: z.number(),
  increaseFrequency: z.nativeEnum(Frequency),
  increaseAmount: z.number(),
  compound: z.boolean(),
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
