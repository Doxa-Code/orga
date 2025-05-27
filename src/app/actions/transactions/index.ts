"use server";

import { TransactionMapper } from "@orga/core/application";
import { TransactionFactory } from "@orga/core/factories";
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

export const makePaymentOnTransaction = securityProcedure
  .input(paymentTransactionInputSchema)
  .handler(async ({ input, ctx: { payload } }) => {
    const makePaymentOnTransaction =
      TransactionFactory.makePaymentOnTransaction();

    await makePaymentOnTransaction.execute({
      amountPaided: input.amountPaided,
      paymentDate: input.paymentDate,
      paymentId: input.paymentId,
      paymentMethod: input.paymentMethod,
      transactionId: input.transactionId,
      userId: payload.user.id,
      walletId: input.walletId,
    });
  });

export const deleteTransaction = securityProcedure
  .input(deleteTransactionSchema)
  .handler(async ({ input, ctx: { payload } }) => {
    const deleteTransaction = TransactionFactory.delete();
    await deleteTransaction.execute({
      transactionId: input.transactionId,
      userId: payload.user.id,
    });
  });

export const searchTransaction = securityProcedure
  .input(searchTransactionInputSchema)
  .output(searchTransactionOutputSchema)
  .handler(async ({ input, ctx: { payload } }) => {
    const searchTransactions = TransactionFactory.searchTransactions();
    const transactions = await searchTransactions.execute({
      userId: payload?.user?.id,
      from: input?.from?.toISOString(),
      to: input?.to?.toISOString(),
      amount: input?.amount,
      q: input?.q,
      type: input?.type,
      walletId: input.walletId,
      id: input.id,
    });
    return transactions.map((transaction) =>
      TransactionMapper.cleanSearchTransaction(transaction),
    );
  });

export const registerTransaction = securityProcedure
  .input(registerTransactionFormSchema)
  .handler(async ({ input, ctx: { payload } }) => {
    const editTransaction = TransactionFactory.edit();
    const createTransaction = TransactionFactory.create();

    if (input.transactionId) {
      await editTransaction.execute({
        defaultInstallmentDueDate: input.defaultInstallmentDueDate,
        defaultInstallmentWalletId: input.defaultInstallmentWalletId,
        transactionId: input.transactionId,
        userId: payload.user.id,
        amount: input.amount,
        categorySequence: input.categorySequence,
        costCenterId: input.costCenterId,
        defaultInstallmentPaymentMethod: input.defaultInstallmentPaymentMethod,
        description: input.description,
        dueDate: input.dueDate,
        installmentCount: input.installmentCount,
        installmentInterval: input.installmentInterval,
        paided: !!input.paided,
        payments: input.payments,
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
      userId: payload.user.id,
      workspaceId: payload.workspaces[0]?.id!,
      costCenterId: input.costCenterId,
      defaultInstallmentPaymentMethod: input.defaultInstallmentPaymentMethod,
      payments: input.payments,
      paided: !!input.paided,
      partnerId: input.partnerId,
      note: input.note,
    });
  });

export const retrieveTransaction = securityProcedure
  .input(retrieveTransactionSchema)
  .output(retrieveTransactionOutputSchema)
  .handler(async ({ input, ctx: { payload } }) => {
    const retrieveTransaction = TransactionFactory.retrieve();
    const transaction = await retrieveTransaction.execute(
      input.transactionId,
      payload.user.id,
    );
    return transaction;
  });

export const searchTransactionToReconcile = securityProcedure
  .input(searchTransactionToReconcileInputSchema)
  .output(searchTransactionToReconcileOutputSchema)
  .handler(async ({ input: inputs, ctx: { payload } }) => {
    const results = [];
    const searchTransaction = TransactionFactory.searchTransactions();
    for (const input of inputs) {
      const [response] = await searchTransaction.execute({
        amount: input.amount,
        from: startOfDay(input.date).toISOString(),
        to: endOfDay(input.date).toISOString(),
        type: input.type,
        userId: payload.user.id,
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
