import { z } from "zod";

const BANK_SCHEMA = z.object({
  thumbnail: z.string(),
  code: z.string(),
  name: z.string(),
});

const WALLET_TRANSACTION_SCHEMA = z.object({
  amount: z.number(),
  type: z.enum(["CREDIT", "DEBIT"]),
  description: z.string(),
  date: z.date(),
});

const WALLET_SCHEMA = z.object({
  id: z.string(),
  bank: BANK_SCHEMA,
  name: z.string(),
  balance: z.number(),
  type: z.enum([
    "BANK_CASH_BOX",
    "CHECKING_ACCOUNT",
    "INVESTMENT_ACCOUNT",
    "OTHERS",
    "SAVINGS_ACCOUNT",
  ]),
  number: z.string(),
  agency: z.string(),
  workspaceId: z.string(),
});

export const listWalletsOutputSchema = z.array(
  z.object({
    id: z.string(),
    flag: z.string(),
    surname: z.string(),
    bankName: z.string(),
    type: z.string(),
    balance: z.number(),
  }),
);
export const listWalletsLikeOptionOutputSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    bank: BANK_SCHEMA,
    type: z.string(),
    agency: z.string(),
    number: z.string(),
  }),
);

export const registerWalletInputSchema = z.object({
  bankCode: z.string(),
  name: z
    .string()
    .min(3, { message: "O nome da conta deve ter no mínimo 3 caracteres" }),
  balance: z.number(),
  agency: z.string().optional(),
  number: z.string().optional(),
  type: z.enum([
    "BANK_CASH_BOX",
    "CHECKING_ACCOUNT",
    "INVESTMENT_ACCOUNT",
    "OTHERS",
    "SAVINGS_ACCOUNT",
  ]),
  walletId: z.string().nullish(),
});

export const retrieveWalletTransactionsHistoryInputSchema = z.object({
  walletId: z.string(),
  from: z.date(),
  to: z.date(),
});

export const retrieveWalletTransactionsHistoryOutputSchema = z
  .object({
    balance: z.number(),
    bankFlag: z.string(),
    surname: z.string(),
    transactions: z.array(WALLET_TRANSACTION_SCHEMA),
    type: z.string(),
  })
  .nullish();

export const retrieveWalletInputSchema = z.object({
  walletId: z.string(),
});

export const deleteWalletInputSchema = z.object({
  walletId: z.string(),
});

export const retrieveWalletOutputSchema = WALLET_SCHEMA;
