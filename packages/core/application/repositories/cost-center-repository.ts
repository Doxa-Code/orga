import { PrismaClient } from "@prisma/client";
import type { CostCenter } from "../../domain/entities/cost-center";
import {
  CostCenterMapper,
  type CostCenterRaw,
} from "../mappers/cost-center-mapper";

interface CostCenterRepository {
  list(workspaces: string[]): Promise<CostCenterRaw[]>;
  save(costCenter: CostCenter): Promise<void>;
  delete(id: string): Promise<void>;
  retrieve(id: string): Promise<CostCenterRaw | null>;
  deleteByWorkspaceId(id: string): Promise<void>;
}

export class CostCenterRepositoryDatabase implements CostCenterRepository {
  private readonly databaseConnection = new PrismaClient().costCenter;

  async retrieve(id: string): Promise<CostCenterRaw | null> {
    const costCenter = await this.databaseConnection.findUnique({
      where: { id },
    });
    if (!costCenter) {
      return null;
    }

    return costCenter;
  }

  async deleteByWorkspaceId(id: string): Promise<void> {
    await this.databaseConnection.deleteMany({ where: { workspaceId: id } });
  }

  async delete(id: string): Promise<void> {
    await this.databaseConnection.delete({ where: { id } });
  }

  async save(costCenter: CostCenter): Promise<void> {
    await this.databaseConnection.create({
      data: CostCenterMapper.toPersist(costCenter),
    });
  }

  async list(workspaces: string[]): Promise<CostCenterRaw[]> {
    const response = await this.databaseConnection.findMany({
      where: {
        workspaceId: { in: workspaces },
      },
    });

    return response;
  }
}
