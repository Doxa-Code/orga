import type { Payment } from "../entities/payment";
import type { Transaction } from "../entities/transaction";
import type { Wallet } from "../entities/wallet";
import { WalletTransaction } from "../valueobjects/wallet-transaction";

interface WalletRepository {
  retrieve(id: string): Promise<Wallet | null>;
  saveWalletTransaction(transaction: WalletTransaction): Promise<void>;
  update(wallet: Wallet): Promise<void>;
}

export type RegisterTransactionInputDTO = {
  type: Transaction.Type;
  payment: Payment;
};

export class RegisterTransactionOnWallet {
  constructor(private readonly walletRepository: WalletRepository) {}

  async reversalPayment(
    payment: Payment,
    type: Transaction.Type,
  ): Promise<void> {
    const wallet = await this.walletRepository.retrieve(payment.walletId);
    if (!wallet) {
      return;
    }

    const walletTransaction = WalletTransaction.create(
      type === "DEBIT" ? "CREDIT" : "DEBIT",
      payment.amountPaided,
      wallet.id,
      `Estorno ${payment.description}`,
    );

    wallet.registerTransaction(walletTransaction);

    await this.walletRepository.update(wallet);
    await this.walletRepository.saveWalletTransaction(walletTransaction);
  }

  async register(transaction: Transaction): Promise<void> {
    for (const payment of transaction.payments) {
      if (payment.amountPaided <= 0) {
        continue;
      }

      const wallet = await this.walletRepository.retrieve(payment.walletId);

      if (!wallet) {
        return;
      }

      const walletTransaction = WalletTransaction.create(
        transaction.type,
        payment.amountPaided,
        wallet.id,
        payment.description,
      );

      wallet.registerTransaction(walletTransaction);

      await this.walletRepository.update(wallet);
      await this.walletRepository.saveWalletTransaction(walletTransaction);
    }
  }

  async unregister(transaction: Transaction): Promise<void> {
    for (const payment of transaction.payments) {
      if (payment.amountPaided <= 0) {
        continue;
      }

      const wallet = await this.walletRepository.retrieve(payment.walletId);
      if (!wallet) {
        return;
      }

      const walletTransaction = WalletTransaction.create(
        transaction.type === "CREDIT" ? "DEBIT" : "CREDIT",
        payment.amount,
        wallet.id,
        `Estorno ${payment.description}`,
      );

      wallet.registerTransaction(walletTransaction);

      await this.walletRepository.update(wallet);
      await this.walletRepository.saveWalletTransaction(walletTransaction);
    }
  }
}
