import { Wallet } from "@/core/domain/entities/wallet";
import { EntityNotFound } from "../../domain/errors/entity-not-found";
import type { WalletTransaction } from "../../domain/valueobjects/wallet-transaction";

interface WalletRepository {
  retrieve(walletId: string): Promise<Wallet | null>;
  retriveTransactionHistory(input: {
    walletId: string;
    from: Date;
    to: Date;
  }): Promise<WalletTransaction[]>;
}

interface VerifyPermissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

interface ImageStorage {
  assigneeImage(key: string): Promise<string>;
}

export class RetrieveWalletTransactionHistory {
  constructor(
    private readonly verifyPermissionService: VerifyPermissionService,
    private readonly walletRepository: WalletRepository,
    private readonly imageStorage: ImageStorage
  ) {}

  async execute(input: InputDTO) {
    const wallet = await this.walletRepository.retrieve(input.walletId);
    if (!wallet) {
      throw new EntityNotFound("wallet");
    }

    await this.verifyPermissionService.execute(
      input.userId,
      wallet.workspaceId
    );

    const transactions = await this.walletRepository.retriveTransactionHistory({
      from: input.from,
      to: input.to,
      walletId: input.walletId,
    });

    return {
      transactions: transactions.map((transaction) => ({
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        type: transaction.type,
        walletId: transaction.walletId,
      })),
      balance: wallet.balance,
      bankFlag: await this.imageStorage.assigneeImage(wallet.bank.thumbnail),
      surname: wallet.name,
      type: String(wallet.type),
    };
  }
}

type InputDTO = {
  walletId: string;
  userId: string;
  from: Date;
  to: Date;
};
