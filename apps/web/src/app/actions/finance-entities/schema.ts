import { TransactionType } from "@/generated/prisma";
import { z } from "zod";

const COST_CENTER_SCHEMA = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  workspaceId: z.string(),
});

const CATEGORY_SCHEMA = z.object({
  type: z.enum([TransactionType.CREDIT, TransactionType.DEBIT]),
  sequence: z.string(),
  name: z.string(),
});

export const listFinanceEntitiesOutputSchema = z.object({
  costCenters: z.array(COST_CENTER_SCHEMA),
  categories: z.array(CATEGORY_SCHEMA),
});

export const listBankOutputSchema = z.array(
  z.object({
    code: z.string(),
    color: z.string(),
    thumbnail: z.string(),
    name: z.string(),
  })
);
