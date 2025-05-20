import type { Transaction } from "../../domain/entities/transaction";
import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { TransactionMapper } from "../mappers/transaction-mapper";

interface TransactionRepository {
  retrieve(id: string): Promise<Transaction | null>;
}

interface VerifyPermissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

export class RetrieveTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly verifyPermissionService: VerifyPermissionService,
  ) {}

  async execute(transactionId: string, userId: string) {
    const transaction =
      await this.transactionRepository.retrieve(transactionId);

    if (!transaction) {
      throw new EntityNotFound("transaction");
    }

    await this.verifyPermissionService.execute(userId, transaction.workspaceId);

    return TransactionMapper.toPersist(transaction);
  }
}
