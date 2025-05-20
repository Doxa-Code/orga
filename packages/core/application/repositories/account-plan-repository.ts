import { PrismaClient } from "@prisma/client";
import type { AccountPlan } from "../../domain/entities/account-plan";
import {
  AccountPlanMapper,
  type AccountPlanRaw,
} from "../mappers/account-plan-mapper";

export interface AccountPlanRepository {
  save(accountsPlans: AccountPlan): Promise<void>;
  exists(name: string, workspaceId: string): Promise<boolean>;
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
  retrieveBySequence(sequence: number): Promise<AccountPlanRaw | null>;
  list(workspaces: string[]): Promise<AccountPlanRaw[]>;
}

export class AccountPlanRepositoryDatabase implements AccountPlanRepository {
  private readonly databaseConnection = new PrismaClient().accountPlan;

  async retrieveBySequence(sequence: number): Promise<AccountPlanRaw | null> {
    const accountPlan = await this.databaseConnection.findFirst({
      where: {
        sequence,
      },
    });

    if (!accountPlan) {
      return null;
    }

    return accountPlan;
  }

  async list(workspaces: string[]): Promise<AccountPlanRaw[]> {
    const result = await this.databaseConnection.findMany({
      where: {
        workspaceId: {
          in: workspaces,
        },
      },
      orderBy: {
        sequence: "asc",
      },
    });

    return result;
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<void> {
    await this.databaseConnection.deleteMany({
      where: {
        workspaceId,
      },
    });
  }

  async save(accountPlan: AccountPlan): Promise<void> {
    await this.databaseConnection.create({
      data: AccountPlanMapper.toPersist(accountPlan),
    });
  }

  async exists(name: string, workspaceId: string): Promise<boolean> {
    const list = await this.databaseConnection.count({
      where: {
        name,
        workspaceId,
      },
    });

    return list > 0;
  }
}
