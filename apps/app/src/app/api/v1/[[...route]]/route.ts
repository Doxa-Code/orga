"use server";
import { TransactionStatus, TransactionType } from "@orga/core/domain";
import { JWTTokenCreatorDriver } from "@orgadrivers";
import { TransactionFactory } from "@orgafactories";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";

const app = new Hono().basePath("/api/v1");

const searchTransactionInputSchema = z.object({
  from: z.string().min(1).optional(),
  to: z.string().min(1).optional(),
  amount: z
    .string()
    .optional()
    .transform((val) => Number(val)),
  q: z.string().optional(),
  walletId: z.string().optional(),
  type: z.enum([TransactionType.CREDIT, TransactionType.DEBIT]).optional(),
  status: z
    .enum([
      TransactionStatus.NO_PAID,
      TransactionStatus.OVERDUE,
      TransactionStatus.PAID,
      TransactionStatus.PAID_TODAY,
    ])
    .optional(),
});

app.get("/transactions", async (c) => {
  const searchTransaction = TransactionFactory.searchTransactions();
  const jwtTokenCreatorDriver = new JWTTokenCreatorDriver<{ userId: string }>();
  const result = searchTransactionInputSchema.safeParse(c.req.query());
  if (result.data?.from && !result.data.to) {
    delete result.data.from;
  }
  if (!result.success || !Object.keys(result.data).length) {
    c.status(401);
    return c.body(
      result?.error?.errors
        .map((err) => err.message)
        .filter(Boolean)
        .join("\n") || "",
    );
  }
  const [, token] = c.req.header("authorization")!.split(" ");
  const payload = jwtTokenCreatorDriver.decoder(token!);
  if (!payload?.userId) {
    c.status(401);
    return c.body("Token is invalid");
  }
  const transactions = await searchTransaction.execute({
    userId: payload?.userId!,
    ...result.data,
  });

  return c.json(transactions);
});

export const GET = handle(app);
