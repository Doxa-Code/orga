import type { Transaction } from "../entities/transaction";

export class WalletTransaction {
  constructor(
    readonly amount: number,
    readonly type: Transaction.Type,
    readonly description: string,
    readonly date: Date,
    readonly walletId: string,
  ) {}

  static create(
    type: Transaction.Type,
    amount: number,
    walletId: string,
    description?: string,
  ) {
    return new WalletTransaction(
      type === "DEBIT" ? (amount || 0) * -1 : amount || 0,
      type,
      description || "",
      new Date(),
      walletId || "",
    );
  }
}
