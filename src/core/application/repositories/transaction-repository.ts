import { Payment } from "@/core/domain/entities/payment";
import { prisma } from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";
import { Transaction } from "../../domain/entities/transaction";
import { CostCenter } from "../../domain/valueobjects/cost-center";
import { TransactionCategory } from "../../domain/valueobjects/transaction-category";

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

type SearchTransactionToReconcileProps = {
  dueDate: Date;
  amount: number;
  type: Transaction.Type;
  workspacesId: string[];
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
  private readonly databaseConnection = prisma.transaction;

  async update(transaction: Transaction): Promise<void> {
    await this.databaseConnection.update({
      data: {
        amount: transaction.amount,
        costCenter: {
          upsert: {
            create: {
              name: transaction.costCenter.name,
              id: transaction.costCenter.id,
              workspaceId: transaction.workspaceId,
            },
            update: {
              name: transaction.costCenter.name,
              workspaceId: transaction.workspaceId,
            },
            where: {
              id: transaction.costCenter.id,
            },
          },
        },
        category: {
          upsert: {
            create: {
              name: transaction.category.name,
              sequence: transaction.category.sequence,
            },
            update: {
              name: transaction.category.name,
              sequence: transaction.category.sequence,
            },
            where: {
              name: transaction.category.name,
              sequence: transaction.category.sequence,
            },
          },
        },
      },
      where: {
        id: transaction.id,
      },
    });
  }

  async retrieve(id: string): Promise<Transaction | null> {
    const transaction = await this.databaseConnection.findUnique({
      where: { id },
      include: {
        category: true,
        costCenter: true,
        payments: true,
      },
    });

    if (!transaction) {
      return null;
    }

    return Transaction.instance({
      amount: transaction.amount,
      category: TransactionCategory.create(
        transaction.category?.sequence,
        transaction.category?.name
      ),
      costCenter: CostCenter.create(
        transaction.costCenter?.id,
        transaction.costCenter?.name
      ),
      description: transaction.description,
      dueDate: transaction.dueDate,
      id: transaction.id,
      note: transaction.note,
      payments: transaction.payments.map(Payment.instance),
      status: transaction.status,
      type: transaction.type,
      workspaceId: transaction.workspaceId,
      partnerId: transaction.partner,
    });
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<void> {
    await this.databaseConnection.deleteMany({ where: { workspaceId } });
  }

  async delete(id: string): Promise<void> {
    await this.databaseConnection.delete({ where: { id } });
  }

  async save(transaction: Transaction): Promise<void> {
    await this.databaseConnection.create({
      data: {
        amount: transaction.amount,
        description: transaction.description,
        dueDate: transaction.dueDate,
        note: transaction.note,
        status: transaction.status,
        type: transaction.type,
        category: {},
        workspace: {
          connect: {
            id: transaction.workspaceId,
          },
        },
      },
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
      include: {
        category: true,
        costCenter: true,
        payments: true,
      },
    });

    return response.map((transaction) =>
      Transaction.instance({
        amount: transaction.amount,
        category: TransactionCategory.create(
          transaction.category?.sequence,
          transaction.category?.name
        ),
        costCenter: CostCenter.create(
          transaction.costCenter?.id,
          transaction.costCenter?.name
        ),
        description: transaction.description,
        dueDate: transaction.dueDate,
        id: transaction.id,
        note: transaction.note,
        payments: transaction.payments.map(Payment.instance),
        status: transaction.status,
        type: transaction.type,
        workspaceId: transaction.workspaceId,
        partnerId: transaction.partner,
      })
    );
  }

  async searchTransactionToReconcile(
    input: SearchTransactionToReconcileProps
  ): Promise<Transaction | null> {
    const transaction = await this.databaseConnection.findFirst({
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
      include: {
        category: true,
        costCenter: true,
        payments: true,
      },
    });

    if (!transaction) {
      return null;
    }

    return Transaction.instance({
      amount: transaction.amount,
      category: TransactionCategory.create(
        transaction.category?.sequence,
        transaction.category?.name
      ),
      costCenter: CostCenter.create(
        transaction.costCenter?.id,
        transaction.costCenter?.name
      ),
      description: transaction.description,
      dueDate: transaction.dueDate,
      id: transaction.id,
      note: transaction.note,
      payments: transaction.payments.map(Payment.instance),
      status: transaction.status,
      type: transaction.type,
      workspaceId: transaction.workspaceId,
      partnerId: transaction.partner,
    });
  }
}
