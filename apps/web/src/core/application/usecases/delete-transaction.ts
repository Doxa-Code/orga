import type { Transaction } from "../../domain/entities/transaction";

interface VerifyPermissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

interface TransactionRepository {
  retrieve(id: string): Promise<Transaction | null>;
  delete(id: string): Promise<void>;
}

interface RegisterTransactionOnWalletService {
  unregister(transaction: Transaction): Promise<void>;
}

export class DeleteTransaction {
  constructor(
    private readonly verifyPermissionService: VerifyPermissionService,
    private readonly transactionRepository: TransactionRepository,
    private readonly registerTransactionOnWalletService: RegisterTransactionOnWalletService,
  ) {}

  async execute(input: InputDTO) {
    const transaction = await this.transactionRepository.retrieve(
      input.transactionId,
    );
    if (!transaction) {
      return;
    }
    await this.verifyPermissionService.execute(
      input.userId,
      transaction.workspaceId,
    );
    await this.transactionRepository.delete(input.transactionId);
    await this.registerTransactionOnWalletService.unregister(transaction);
  }
}

type InputDTO = {
  transactionId: string;
  userId: string;
};
