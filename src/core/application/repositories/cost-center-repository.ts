import { prisma } from "@/lib/prisma";
import { CostCenter } from "../../domain/entities/cost-center";

interface CostCenterRepository {
  list(workspaces: string[]): Promise<CostCenter[]>;
  save(costCenter: CostCenter): Promise<void>;
  delete(id: string): Promise<void>;
  retrieve(id: string): Promise<CostCenter | null>;
  deleteByWorkspaceId(id: string): Promise<void>;
}

export class CostCenterRepositoryDatabase implements CostCenterRepository {
  private readonly databaseConnection = prisma.costCenter as any;

  async retrieve(id: string): Promise<CostCenter | null> {
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
      data: {
        code: costCenter.code,
        name: costCenter.name,
        id: costCenter.id,
        workspaceId: costCenter.workspaceId,
      },
    });
  }

  async list(workspaces: string[]): Promise<CostCenter[]> {
    const response = await this.databaseConnection.findMany({
      where: {
        workspaceId: { in: workspaces },
      },
    });

    return response.map(CostCenter.instance);
  }
}
