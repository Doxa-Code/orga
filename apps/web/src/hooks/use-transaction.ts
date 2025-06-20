import { Transaction } from "@/core/domain/entities/transaction";
import { create } from "zustand";

export type TransactionToReconcile = {
  transactionFromOFXId: string;
  id: string;
  amount: number;
  dueDate: Date;
  type: Transaction.Type;
  description: string;
  partnerName: string;
  category: string;
  transactionId: string;
};

export type TransactionFromOFX = {
  amount: number;
  date: Date;
  description: string;
  id: string;
  type: Transaction.Type;
};

export type LoadOFXOutputDTO = {
  transactionFromOFX: TransactionFromOFX;
  transactionToReconcile: TransactionToReconcile | null;
};

type Store = {
  transactionId: string | null;
  typeToCreate?: Transaction.Type;
  paymentId: string | null;
  transactionsToReconcile: LoadOFXOutputDTO[];
  onFinishRegister: null | (() => Promise<void> | void);
};

type Action = {
  set(values: Partial<Store>): void;
  unlinkTransaction(transactionFromOFXId?: string): void;
  linkTransaction(transactionToReconcile: TransactionToReconcile): void;
};

type TransactionStore = Store & Action;

const INITIAL_VALUES: Store = {
  typeToCreate: "CREDIT",
  transactionsToReconcile: [],
  transactionId: null,
  paymentId: null,
  onFinishRegister: null,
};

export const useTransaction = create<TransactionStore>((set, get) => ({
  ...INITIAL_VALUES,
  set,
  unlinkTransaction(transactionFromOFXId) {
    set({
      transactionsToReconcile: get().transactionsToReconcile.map(
        (transactions) =>
          transactions.transactionFromOFX.id === transactionFromOFXId
            ? {
                transactionFromOFX: transactions.transactionFromOFX,
                transactionToReconcile: null,
              }
            : transactions
      ),
    });
  },
  linkTransaction(transactionToReconcile) {
    console.log(transactionToReconcile);
    set({
      transactionsToReconcile: get().transactionsToReconcile.map(
        (transactions) =>
          transactions.transactionFromOFX.id ===
          transactionToReconcile.transactionFromOFXId
            ? {
                transactionFromOFX: transactions.transactionFromOFX,
                transactionToReconcile,
              }
            : transactions
      ),
    });
  },
}));
