import { prisma } from "@/lib/prisma";
import { AccountPlan } from "../../domain/entities/account-plan";
import { AccountPlanCategory } from "../../domain/valueobjects/account-plan-category";

export interface AccountPlanRepository {
  save(accountsPlans: AccountPlan): Promise<void>;
  exists(name: string, workspaceId: string): Promise<boolean>;
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
  retrieveBySequence(sequence: number): Promise<AccountPlan | null>;
  list(workspaces: string[]): Promise<AccountPlan[]>;
}

export class AccountPlanRepositoryDatabase implements AccountPlanRepository {
  private readonly databaseConnection = prisma;

  async retrieveBySequence(sequence: number): Promise<AccountPlan | null> {
    const accountPlan = await this.databaseConnection.accountPlan.findFirst({
      where: {
        sequence,
      },
      include: {
        categories: true,
      },
    });

    if (!accountPlan) {
      return null;
    }

    return AccountPlan.instance({
      categories: accountPlan.categories.map(AccountPlanCategory.instance),
      id: accountPlan.id,
      name: accountPlan.name,
      operation: accountPlan.operation,
      sequence: accountPlan.sequence,
      type: accountPlan.type,
      workspaceId: accountPlan.workspaceId,
    });
  }

  async list(workspaces: string[]): Promise<AccountPlan[]> {
    const result = await this.databaseConnection.accountPlan.findMany({
      where: {
        workspaceId: {
          in: workspaces,
        },
      },
      include: {
        categories: true,
      },
      orderBy: {
        sequence: "asc",
      },
    });

    return result.map(
      (accountPlan: {
        categories: { sequence: string; name: string; amount: number }[];
        id: any;
        name: any;
        operation: any;
        sequence: any;
        type: any;
        workspaceId: any;
      }) =>
        AccountPlan.instance({
          categories: accountPlan.categories.map(AccountPlanCategory.instance),
          id: accountPlan.id,
          name: accountPlan.name,
          operation: accountPlan.operation,
          sequence: accountPlan.sequence,
          type: accountPlan.type,
          workspaceId: accountPlan.workspaceId,
        })
    );
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<void> {
    await this.databaseConnection.$transaction([
      this.databaseConnection.accountPlan.deleteMany({
        where: {
          workspaceId,
        },
      }),
      this.databaseConnection.accountPlanCategory.deleteMany({
        where: {
          plan: {
            workspaceId,
          },
        },
      }),
    ]);
  }

  async save(accountPlan: AccountPlan): Promise<void> {
    await this.databaseConnection.accountPlan.create({
      data: {
        name: accountPlan.name,
        operation: accountPlan.operation,
        sequence: accountPlan.sequence,
        type: accountPlan.type,
        categories: {
          createMany: {
            data: accountPlan.categories,
          },
        },
        id: accountPlan.id,
        workspaceId: accountPlan.workspaceId,
      },
    });
  }

  async exists(name: string, workspaceId: string): Promise<boolean> {
    const list = await this.databaseConnection.accountPlan.count({
      where: {
        name,
        workspaceId,
      },
    });

    return list > 0;
  }
}
