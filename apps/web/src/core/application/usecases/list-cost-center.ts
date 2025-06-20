import { CostCenter } from "@/core/domain/entities/cost-center";
import { Workspace } from "@/core/domain/entities/workspace";

interface CostCenterRepository {
  list(workspacesId: string[]): Promise<CostCenter[]>;
}

interface WorkspaceRepository {
  retrieve(id: string): Promise<Workspace | null>;
}

interface VerifyPermissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

export class ListCostCenter {
  constructor(
    private readonly costCenterRepository: CostCenterRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly verifyPermissionService: VerifyPermissionService
  ) {}

  async execute(
    workspacesId: string[],
    userId: string
  ): Promise<ListCostCenterOutputDTO[]> {
    await Promise.all(
      workspacesId.map(
        async (workspaceId) =>
          await this.verifyPermissionService.execute(userId, workspaceId)
      )
    );

    const costCenters = await this.costCenterRepository.list(workspacesId);

    return await Promise.all<ListCostCenterOutputDTO>(
      costCenters.map(async (costCenter) => {
        const workspace = await this.workspaceRepository.retrieve(
          costCenter.workspaceId
        );
        return {
          id: costCenter.id,
          code: costCenter.code,
          name: costCenter.name,
          workspace: {
            id: workspace?.id || costCenter.workspaceId,
            name: workspace?.name || "Não encontrada",
          },
        };
      })
    );
  }
}

export interface ListCostCenterOutputDTO {
  id: string;
  code: string;
  name: string;
  workspace: {
    id: string;
    name: string;
  };
}
