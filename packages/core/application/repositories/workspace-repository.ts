import { PrismaClient } from "@prisma/client";
import type { Workspace } from "../../domain/entities/workspace";
import {
  WorkspaceMapper,
  type WorkspaceRaw,
} from "../mappers/workspace-mapper";

export interface WorkspaceRepository {
  create(workspace: Workspace): Promise<void>;
  delete(workspaceId: string): Promise<void>;
  retrieve(workspaceId: string): Promise<WorkspaceRaw | null>;
}

export class WorkspaceRepositoryDatabase implements WorkspaceRepository {
  private readonly databaseConnection = new PrismaClient();

  async retrieve(workspaceId: string): Promise<WorkspaceRaw | null> {
    const result = await this.databaseConnection.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!result) {
      return null;
    }
    return result;
  }

  async delete(workspaceId: string): Promise<void> {
    await this.databaseConnection.workspace.delete({
      where: { id: workspaceId },
      include: {
        accountPlan: true,
        costCenter: true,
        partner: true,
        transaction: true,
        wallet: {
          include: {
            transactions: true,
          },
        },
      },
    });
  }

  async create(workspace: Workspace): Promise<void> {
    await this.databaseConnection.workspace.create({
      data: WorkspaceMapper.toPersist(workspace),
    });
  }
}
