import { prisma } from "@/lib/prisma";
import { Wallet } from "../../domain/entities/wallet";
import { WalletBank } from "../../domain/valueobjects/wallet-bank";
import { WalletTransaction } from "../../domain/valueobjects/wallet-transaction";

type RetrieveTransactionHistoryProps = {
  walletId: string;
  from: Date;
  to: Date;
};

interface WalletRepository {
  save(wallet: Wallet): Promise<void>;
  list(workspacesId: string[]): Promise<Wallet[]>;
  delete(id: string): Promise<void>;
  retrieve(id: string): Promise<Wallet | null>;
  update(wallet: Wallet): Promise<void>;
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
  retriveTransactionHistory(
    input: RetrieveTransactionHistoryProps
  ): Promise<WalletTransaction[]>;
}

export class WalletRepositoryDatabase implements WalletRepository {
  private readonly databaseConnection = prisma;

  async retriveTransactionHistory(
    input: RetrieveTransactionHistoryProps
  ): Promise<WalletTransaction[]> {
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

    return transactionHistory.map(WalletTransaction.instance);
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<void> {
    const wallets = await this.databaseConnection.wallet.findMany({
      where: { workspaceId },
    });
    await this.databaseConnection.$transaction([
      this.databaseConnection.walletTransaction.deleteMany({
        where: { walletId: { in: wallets.map((wl: { id: any }) => wl.id) } },
      }),
      this.databaseConnection.wallet.deleteMany({ where: { workspaceId } }),
    ]);
  }

  async update(wallet: Wallet): Promise<void> {
    const bank = await this.databaseConnection.bank.findUnique({
      where: {
        code: wallet.bank.code,
      },
    });

    await this.databaseConnection.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        agency: wallet.agency,
        balance: wallet.balance,
        bankId: bank?.id,
        id: wallet.id,
        name: wallet.name,
        number: wallet.number,
        transactions: {
          upsert: wallet.transactions.map((transaction) => ({
            create: {
              amount: transaction.amount,
              date: transaction.date,
              description: transaction.description,
              type: transaction.type,
              id: transaction.id,
            },
            update: {
              amount: transaction.amount,
              date: transaction.date,
              description: transaction.description,
              type: transaction.type,
            },
            where: {
              id: transaction.id,
            },
          })),
        },
        type: wallet.type,
        workspaceId: wallet.workspaceId,
      },
    });
  }

  async retrieve(id: string): Promise<Wallet | null> {
    const wallet = await this.databaseConnection.wallet.findFirst({
      where: { id },
      include: {
        transactions: true,
        bank: true,
      },
    });

    if (!wallet) {
      return null;
    }
    return Wallet.instance({
      agency: wallet.agency,
      balance: wallet.balance,
      bank: WalletBank.create(
        wallet.bank?.code,
        wallet.bank?.name,
        wallet.bank?.thumbnail
      ),
      id: wallet.id,
      name: wallet.name,
      number: wallet.number,
      transactions: wallet.transactions.map(WalletTransaction.instance),
      type: wallet.type,
      workspaceId: wallet.workspaceId,
    });
  }

  async delete(id: string): Promise<void> {
    await this.databaseConnection.$transaction([
      this.databaseConnection.walletTransaction.deleteMany({
        where: { walletId: id },
      }),
      this.databaseConnection.wallet.delete({ where: { id } }),
    ]);
  }

  async list(workspacesId: string[]): Promise<Wallet[]> {
    const list = await this.databaseConnection.wallet.findMany({
      where: {
        workspaceId: { in: workspacesId },
      },
      include: {
        transactions: true,
        bank: true,
      },
    });

    return list.map(
      (wallet: {
        agency: any;
        balance: any;
        bank: any;
        id: any;
        name: any;
        number: any;
        transactions: any;
        type: any;
        workspaceId: any;
      }) =>
        Wallet.instance({
          agency: wallet.agency,
          balance: wallet.balance,
          bank: WalletBank.create(
            wallet.bank?.code,
            wallet.bank?.name,
            wallet.bank?.thumbnail
          ),
          id: wallet.id,
          name: wallet.name,
          number: wallet.number,
          transactions: wallet.transactions.map(WalletTransaction.instance),
          type: wallet.type,
          workspaceId: wallet.workspaceId,
        })
    );
  }

  async save(wallet: Wallet): Promise<void> {
    const bank = await this.databaseConnection.bank.findUnique({
      where: {
        code: wallet.bank.code,
      },
    });
    await this.databaseConnection.wallet.create({
      data: {
        agency: wallet.agency,
        balance: wallet.balance,
        name: wallet.name,
        number: wallet.number,
        type: wallet.type,
        bankId: bank?.id,
        workspaceId: wallet.workspaceId,
        id: wallet.id,
        transactions: {
          createMany: {
            data: wallet.transactions,
          },
        },
      },
    });
  }
}
