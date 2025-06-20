import { z } from "zod";

const PAYMENT_SCHEMA = z.object({
  id: z.string(),
  dueDate: z.date(),
  amount: z.number(),
  percentage: z.number(),
  paymentMethod: z.string(),
  walletId: z.string(),
  description: z.string(),
  fees: z.number(),
  fine: z.number(),
  createdAt: z.date(),
  status: z.enum(["NO_PAID", "PAID"]),
  paidedDate: z.date().nullish(),
  amountPaided: z.number(),
});

const TRANSACTION_SCHEMA = z.object({
  id: z.string(),
  workspaceId: z.string(),
  description: z.string(),
  amount: z.number(),
  dueDate: z.date(),
  type: z.enum(["CREDIT", "DEBIT"]),
  status: z.enum(["NO_PAID", "OVERDUE", "PAID", "PAID_TODAY"]),
  costCenter: z.object({ id: z.string(), name: z.string() }),
  category: z.object({ sequence: z.string(), name: z.string() }),
  note: z.string(),
  payments: z.array(PAYMENT_SCHEMA),
  partnerId: z.string().nullish().optional(),
});

export const retrieveTransactionOutputSchema = TRANSACTION_SCHEMA;

export const retrieveTransactionSchema = z.object({
  transactionId: z.string().uuid(),
});

export const deleteTransactionSchema = z.object({
  transactionId: z.string().uuid(),
});

export const registerTransactionFormSchema = z.object({
  type: z.enum(["CREDIT", "DEBIT"]),
  dueDate: z.date(),
  description: z
    .string()
    .min(3, { message: "Informe uma descrição para o lançamento" }),
  amount: z.number(),
  categorySequence: z.string({
    message: "Preencha a categoria para continuar",
  }),
  costCenterId: z.string().optional(),
  installmentCount: z.number(),
  installmentInterval: z.number(),
  defaultInstallmentDueDate: z.date(),
  defaultInstallmentPaymentMethod: z.string(),
  paided: z.boolean().optional(),
  defaultInstallmentWalletId: z
    .string()
    .min(30, { message: "Informe uma conta de destino" }),
  note: z.string().optional(),
  payments: z.array(
    z.object({
      dueDate: z.date(),
      amount: z.number(),
      percentage: z.number(),
      paymentMethod: z.string(),
      walletId: z.string(),
      description: z.string(),
    }),
  ),
  partnerId: z.string().uuid().nullish(),
  transactionId: z.string().uuid().nullish(),
});

export const searchTransactionInputSchema = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  amount: z.number().optional(),
  q: z.string().optional(),
  walletId: z.string().optional(),
  type: z.enum(["CREDIT", "DEBIT"]).optional(),
  id: z.string().optional(),
});

export const searchTransactionOutputSchema = z.array(
  z.object({
    id: z.string(),
    amount: z.number(),
    amountPaided: z.number(),
    description: z.string(),
    type: z.enum(["CREDIT", "DEBIT"]),
    category: z.string(),
    dueDate: z.date(),
    status: z.enum(["NO_PAID", "PAID"]),
    partnerName: z.string(),
    transactionId: z.string(),
    walletFlag: z.string(),
    walletId: z.string(),
    costCenter: z.string(),
  }),
);

export const paymentTransactionInputSchema = z.object({
  transactionId: z.string(),
  paymentId: z.string(),
  paymentDate: z.date(),
  amountPaided: z.number(),
  paymentMethod: z.string(),
  walletId: z.string(),
});

export const searchTransactionToReconcileInputSchema = z.array(
  z.object({
    id: z.string(),
    amount: z.number(),
    date: z.date(),
    type: z.enum(["CREDIT", "DEBIT"]),
  }),
);

export const searchTransactionToReconcileOutputSchema = z.array(
  z.object({
    transactionFromOFXId: z.string(),
    id: z.string(),
    description: z.string(),
    amount: z.number(),
    dueDate: z.date(),
    type: z.enum(["CREDIT", "DEBIT"]),
    costCenter: z.string(),
    category: z.string(),
    partnerName: z.string(),
  }),
);
