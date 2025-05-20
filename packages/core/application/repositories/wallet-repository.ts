import { PrismaClient } from "@prisma/client";
import type { Wallet } from "../../domain/entities/wallet";
import type { WalletTransaction } from "../../domain/valueobjects/wallet-transaction";
import { WalletMapper, type WalletRaw } from "../mappers/wallet-mapper";

interface WalletRepository {
  save(wallet: Wallet): Promise<void>;
  list(workspacesId: string[]): Promise<WalletRaw[]>;
  delete(id: string): Promise<void>;
  retrieve(id: string): Promise<Wallet | null>;
  update(wallet: Wallet): Promise<void>;
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
  saveWalletTransaction(transaction: WalletTransaction): Promise<void>;
  retriveTransactionHistory(input: {
    walletId: string;
    from: Date;
    to: Date;
  }): Promise<WalletTransaction[]>;
}

export class WalletRepositoryDatabase implements WalletRepository {
  private readonly databaseConnection = new PrismaClient();

  async retriveTransactionHistory(input: {
    walletId: string;
    from: Date;
    to: Date;
  }): Promise<WalletTransaction[]> {
    const transactionHistory =
      await this.databaseConnection.walletTransaction.findMany({
        where: {
          walletId: input.walletId,
          date: {
            gte: input.from,
            lte: input.to,
          },
        },
      });

    return transactionHistory.map((transaction) => ({
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      type: transaction.type,
      walletId: transaction.walletId,
    }));
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<void> {
    const wallets = await this.databaseConnection.wallet.findMany({
      where: { workspaceId },
    });
    await this.databaseConnection.$transaction([
      this.databaseConnection.walletTransaction.deleteMany({
        where: { walletId: { in: wallets.map((wl) => wl.id) } },
      }),
      this.databaseConnection.wallet.deleteMany({ where: { workspaceId } }),
    ]);
  }

  async update(wallet: Wallet): Promise<void> {
    const { transactions, ...walletRaw } = WalletMapper.toPersist(wallet);

    await this.databaseConnection.wallet.update({
      where: {
        id: wallet.id,
      },
      data: walletRaw,
    });
  }

  async retrieve(id: string): Promise<Wallet | null> {
    const wallet = await this.databaseConnection.wallet.findFirst({
      where: { id },
      include: {
        transactions: true,
      },
    });

    if (!wallet) {
      return null;
    }
    return WalletMapper.toDomain(wallet);
  }

  async delete(id: string): Promise<void> {
    await this.databaseConnection.$transaction([
      this.databaseConnection.walletTransaction.deleteMany({
        where: { walletId: id },
      }),
      this.databaseConnection.wallet.delete({ where: { id } }),
    ]);
  }

  async list(workspacesId: string[]): Promise<WalletRaw[]> {
    const list = await this.databaseConnection.wallet.findMany({
      where: {
        workspaceId: { in: workspacesId },
      },
      include: {
        transactions: true,
      },
    });

    return list;
  }

  async save(wallet: Wallet): Promise<void> {
    const { transactions, ...walletRaw } = WalletMapper.toPersist(wallet);
    await this.databaseConnection.$transaction([
      this.databaseConnection.wallet.create({ data: walletRaw }),
      this.databaseConnection.walletTransaction.create({
        data: transactions[0]!,
      }),
    ]);
  }

  async saveWalletTransaction(transaction: WalletTransaction): Promise<void> {
    await this.databaseConnection.walletTransaction.create({
      data: transaction,
    });
  }
}
