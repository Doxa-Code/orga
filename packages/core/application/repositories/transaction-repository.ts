import { PrismaClient } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import type { Transaction } from "../../domain/entities/transaction";
import { TransactionMapper } from "../mappers/transaction-mapper";

export type Query = {
  from?: string;
  to?: string;
  workspacesId: string[];
  q?: string;
  walletId?: string;
  type?: Transaction.Type;
  amount?: number;
  status?: Transaction.Status;
  id?: string;
};

interface TransactionRepository {
  search(query: Query): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<void>;
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
  delete(id: string): Promise<void>;
  retrieve(id: string): Promise<Transaction | null>;
  update(transaction: Transaction): Promise<void>;
}

export class TransactionRepositoryDatabase implements TransactionRepository {
  private readonly databaseConnection = new PrismaClient().transaction;

  async update(transaction: Transaction): Promise<void> {
    await this.databaseConnection.update({
      data: TransactionMapper.toPersist(transaction),
      where: {
        id: transaction.id,
      },
    });
  }

  async retrieve(id: string): Promise<Transaction | null> {
    const transactionRaw = await this.databaseConnection.findUnique({
      where: { id },
    });

    if (!transactionRaw) {
      return null;
    }

    return TransactionMapper.toDomain(transactionRaw);
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<void> {
    await this.databaseConnection.deleteMany({ where: { workspaceId } });
  }

  async delete(id: string): Promise<void> {
    await this.databaseConnection.delete({ where: { id } });
  }

  async save(transaction: Transaction): Promise<void> {
    await this.databaseConnection.create({
      data: TransactionMapper.toPersist(transaction),
    });
  }

  async search(queryParams: Query): Promise<Transaction[]> {
    const query: Record<string, any> = {
      workspaceId: { $in: queryParams.workspacesId },
    };

    if (queryParams.from && queryParams.to) {
      query["payments.dueDate"] = {
        $gte: new Date(queryParams.from),
        $lt: new Date(queryParams.to),
      };
    }

    if (queryParams.q) {
      query.$or = [
        { "payments.description": new RegExp(queryParams.q!, "gim") },
        { description: new RegExp(queryParams.q!, "gim") },
        { note: new RegExp(queryParams.q!, "gim") },
        { "partner.name": new RegExp(queryParams.q!, "gim") },
      ];
    }

    if (queryParams.walletId) {
      query["payments.walletId"] = queryParams.walletId;
    }

    if (queryParams.type) {
      query.type = queryParams.type;
    }

    if (queryParams.type) {
      query.status = queryParams.status;
    }

    if (queryParams.amount) {
      query.amount = queryParams.amount;
    }

    if (queryParams.id) {
      query.id = queryParams.id;
    }

    const response = await this.databaseConnection.findMany({
      where: query,
    });

    return response.map(TransactionMapper.toDomain);
  }

  async searchTransactionToReconcile(input: {
    dueDate: Date;
    amount: number;
    type: Transaction.Type;
    workspacesId: string[];
  }): Promise<Transaction | null> {
    const transactionRaw = await this.databaseConnection.findFirst({
      where: {
        AND: [
          {
            amount: input.amount,
          },
          {
            dueDate: {
              gte: startOfDay(input.dueDate),
              lt: endOfDay(input.dueDate),
            },
          },
          {
            type: input.type,
          },
          {
            status: { not: "PAID" },
          },
          {
            workspaceId: { in: input.workspacesId },
          },
        ],
      },
    });

    if (!transactionRaw) {
      return null;
    }

    return TransactionMapper.toDomain(transactionRaw);
  }
}
