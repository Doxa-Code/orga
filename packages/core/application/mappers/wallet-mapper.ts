import { Wallet } from "../../domain/entities/wallet";
import { WalletBank } from "../../domain/valueobjects/wallet-bank";
import { WalletTransaction } from "../../domain/valueobjects/wallet-transaction";

export interface WalletTransactionRaw {
  amount: number;
  type: string;
  description: string;
  date: Date;
  walletId: string;
}

export interface WalletRaw {
  id: string;
  bank: {
    code: string;
    name: string;
    thumbnail: string;
  };
  name: string;
  balance: number;
  type: Wallet.Type;
  number: string;
  agency: string;
  workspaceId: string;
  transactions: WalletTransaction[];
}

export class WalletMapper {
  static toDomain(wallet: WalletRaw) {
    return new Wallet({
      bank: WalletBank.create(
        wallet.bank.code,
        wallet.bank.name,
        wallet.bank.thumbnail,
      ),
      id: wallet.id,
      name: wallet.name,
      number: wallet.number,
      type: wallet.type as Wallet.Type,
      workspaceId: wallet.workspaceId,
      agency: wallet.agency,
      transactions: wallet?.transactions?.map(
        (transaction) =>
          new WalletTransaction(
            transaction.amount,
            transaction.type,
            transaction.description,
            transaction.date,
            wallet.id,
          ),
      ),
    });
  }
  static toPersist(wallet: Wallet): WalletRaw {
    return {
      agency: wallet.agency,
      balance: wallet.balance,
      bank: {
        code: wallet.bank.code,
        name: wallet.bank.name,
        thumbnail: wallet.bank.thumbnail,
      },
      id: wallet.id,
      name: wallet.name,
      number: wallet.number,
      type: wallet.type,
      workspaceId: wallet.workspaceId,
      transactions: wallet?.transactions?.map((transaction) => ({
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        type: transaction.type,
        walletId: transaction.walletId,
      })),
    };
  }

  static toForm(wallet: Omit<WalletRaw, "transactionHistory">) {
    return {
      bankCode: wallet.bank.code,
      name: wallet.name,
      balance: wallet.balance,
      agency: wallet.agency,
      number: wallet.number,
      type: wallet.type,
    };
  }
}
