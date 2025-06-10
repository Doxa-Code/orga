"use server";

import { endOfDay, startOfDay } from "date-fns";
import { securityProcedure } from "../security-procedure";
import {
  deleteTransactionSchema,
  paymentTransactionInputSchema,
  registerTransactionFormSchema,
  retrieveTransactionOutputSchema,
  retrieveTransactionSchema,
  searchTransactionInputSchema,
  searchTransactionOutputSchema,
  searchTransactionToReconcileInputSchema,
  searchTransactionToReconcileOutputSchema,
} from "./schema";
import { TransactionFactory } from "@/core/infra/factories/transaction-factory";
import { Transaction } from "@/core/domain/entities/transaction";
import { Payment } from "@/core/domain/entities/payment";

export const makePaymentOnTransaction = securityProcedure
  .input(paymentTransactionInputSchema)
  .handler(async ({ input, ctx: { user } }) => {
    const makePaymentOnTransaction =
      TransactionFactory.makePaymentOnTransaction();

    await makePaymentOnTransaction.execute({
      amountPaided: input.amountPaided,
      paymentDate: input.paymentDate,
      paymentId: input.paymentId,
      paymentMethod: input.paymentMethod as Payment.Method,
      transactionId: input.transactionId,
      userId: user.id,
      walletId: input.walletId,
    });
  });

export const deleteTransaction = securityProcedure
  .input(deleteTransactionSchema)
  .handler(async ({ input, ctx: { user } }) => {
    const deleteTransaction = TransactionFactory.delete();
    await deleteTransaction.execute({
      transactionId: input.transactionId,
      userId: user.id,
    });
  });

export const searchTransaction = securityProcedure
  .input(searchTransactionInputSchema)
  .output(searchTransactionOutputSchema)
  .handler(async ({ input, ctx: { user } }) => {
    const searchTransactions = TransactionFactory.searchTransactions();
    const transactions = await searchTransactions.execute({
      userId: user?.id,
      from: input?.from?.toISOString(),
      to: input?.to?.toISOString(),
      amount: input?.amount,
      q: input?.q,
      type: input?.type,
      walletId: input.walletId,
      id: input.id,
    });
    return transactions;
  });

export const registerTransaction = securityProcedure
  .input(registerTransactionFormSchema)
  .handler(async ({ input, ctx: { user, workspace } }) => {
    const editTransaction = TransactionFactory.edit();
    const createTransaction = TransactionFactory.create();

    if (input.transactionId) {
      await editTransaction.execute({
        defaultInstallmentDueDate: input.defaultInstallmentDueDate,
        defaultInstallmentWalletId: input.defaultInstallmentWalletId,
        transactionId: input.transactionId,
        userId: user.id,
        amount: input.amount,
        categorySequence: input.categorySequence,
        costCenterId: input.costCenterId,
        defaultInstallmentPaymentMethod:
          input.defaultInstallmentPaymentMethod as Payment.Method,
        description: input.description,
        dueDate: input.dueDate,
        installmentCount: input.installmentCount,
        installmentInterval: input.installmentInterval,
        paided: !!input.paided,
        payments: input.payments as Payment[],
        partnerId: input.partnerId,
        note: input.note,
      });
      return;
    }

    await createTransaction.execute({
      amount: input.amount,
      categorySequence: input.categorySequence,
      defaultInstallmentDueDate: input.defaultInstallmentDueDate,
      defaultInstallmentWalletId: input.defaultInstallmentWalletId,
      description: input.description,
      dueDate: input.dueDate,
      type: input.type,
      userId: user.id,
      workspaceId: workspace.id,
      costCenterId: input.costCenterId,
      defaultInstallmentPaymentMethod:
        input.defaultInstallmentPaymentMethod as Payment.Method,
      payments: input.payments as Payment[],
      paided: !!input.paided,
      partnerId: input.partnerId,
      note: input.note,
    });
  });

export const retrieveTransaction = securityProcedure
  .input(retrieveTransactionSchema)
  .output(retrieveTransactionOutputSchema)
  .handler(async ({ input, ctx: { user } }) => {
    const retrieveTransaction = TransactionFactory.retrieve();
    const transaction = await retrieveTransaction.execute(
      input.transactionId,
      user.id
    );
    return transaction;
  });

export const searchTransactionToReconcile = securityProcedure
  .input(searchTransactionToReconcileInputSchema)
  .output(searchTransactionToReconcileOutputSchema)
  .handler(async ({ input: inputs, ctx: { user } }) => {
    const results = [];
    const searchTransaction = TransactionFactory.searchTransactions();
    for (const input of inputs) {
      const [response] = await searchTransaction.execute({
        amount: input.amount,
        from: startOfDay(input.date).toISOString(),
        to: endOfDay(input.date).toISOString(),
        type: input.type,
        userId: user.id,
      });
      if (!response) continue;
      results.push({
        id: response.transactionId,
        description: response.description,
        amount: response.amount,
        dueDate: response.dueDate,
        type: response.type,
        costCenter: response.costCenter,
        category: response.category,
        partnerName: response.partnerName,
        transactionFromOFXId: input.id,
      });
    }

    return results;
  });
