import { WalletBank } from "../valueobjects/wallet-bank";
import { WalletTransaction } from "../valueobjects/wallet-transaction";
import type { Bank } from "./bank";

export namespace Wallet {
  export type Type =
    | "CHECKING_ACCOUNT"
    | "BANK_CASH_BOX"
    | "SAVINGS_ACCOUNT"
    | "INVESTMENT_ACCOUNT"
    | "OTHERS";
  export interface Props {
    id: string;
    bank: WalletBank;
    name: string;
    balance: number;
    type: Type;
    number: string;
    agency: string;
    workspaceId: string;
    transactions: WalletTransaction[];
  }
}

type CreateInputDTO = {
  bank: Bank;
  name: string;
  workspaceId: string;
  type?: Wallet.Type;
  balance?: number;
  number?: string;
  agency?: string;
};

type UpdateInputDTO = {
  bank?: Bank;
  name?: string;
  type?: string;
  balance?: number;
  number?: string;
  agency?: string;
};

export class Wallet {
  public id: string;
  public bank: WalletBank;
  public name: string;
  public type: Wallet.Type;
  public number: string;
  public agency: string;
  public workspaceId: string;
  public transactions: WalletTransaction[];

  constructor(props: Omit<Wallet.Props, "balance">) {
    this.id = props.id;
    this.bank = props.bank;
    this.name = props.name;
    this.type = props.type;
    this.number = props.number;
    this.agency = props.agency;
    this.workspaceId = props.workspaceId;
    this.transactions = props.transactions;
  }

  get balance() {
    return this.transactions.reduce(
      (balance, transaction) => balance + transaction.amount,
      0,
    );
  }

  static instance(props: Wallet.Props) {
    return new Wallet(props);
  }

  static create(input: CreateInputDTO) {
    const wallet = new Wallet({
      id: crypto.randomUUID().toString(),
      agency: input.agency || "",
      bank: WalletBank.create(
        input?.bank?.code,
        input?.bank?.name,
        input?.bank?.thumbnail,
      ),
      name: input.name,
      number: input.number || "",
      type: input.type || "OTHERS",
      workspaceId: input.workspaceId,
      transactions: [],
    });

    wallet.registerTransaction(
      WalletTransaction.create(
        "CREDIT",
        input.balance || 0,
        wallet.id,
        "Saldo inicial",
      ),
    );

    return wallet;
  }

  update(input: UpdateInputDTO) {
    this.bank = input.bank
      ? WalletBank.create(
          input.bank.code,
          input.bank.name,
          input.bank.thumbnail,
        )
      : this.bank;
    this.name = input.name || this.name;
    this.type = (input.type as Wallet.Type) || this.type;
    this.number = input.number || this.number;
    this.agency = input.agency || this.agency;
  }

  registerTransaction(transaction: WalletTransaction) {
    this.transactions.push(transaction);
  }
}
