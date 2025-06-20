import type { Transaction } from "../entities/transaction";

type Props = {
  id: string;
  amount: number;
  type: Transaction.Type;
  description: string;
  date: Date;
  walletId: string;
};

export class WalletTransaction {
  constructor(
    readonly id: string,
    readonly amount: number,
    readonly type: Transaction.Type,
    readonly description: string,
    readonly date: Date,
    readonly walletId: string,
  ) {}

  static instance(props: Props) {
    return new WalletTransaction(
      props.id,
      props.amount,
      props.type,
      props.description,
      props.date,
      props.walletId,
    );
  }

  static create(
    type: Transaction.Type,
    amount: number,
    walletId: string,
    description?: string,
  ) {
    return new WalletTransaction(
      crypto.randomUUID().toString(),
      type === "DEBIT" ? (amount || 0) * -1 : amount || 0,
      type,
      description || "",
      new Date(),
      walletId || "",
    );
  }
}
