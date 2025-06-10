import { Workspace } from "@/core/domain/entities/workspace";
import { CostCenter } from "../../domain/entities/cost-center";
import { FieldInvalid } from "../../domain/errors/field-invalid";

interface CostCenterRepository {
  save(costCenter: CostCenter): Promise<void>;
}

interface WorkspaceRepository {
  retrieve(id: string): Promise<Workspace | null>;
}

interface VerifyPermissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

export class CreateCostCenter {
  constructor(
    private readonly costCenterRepository: CostCenterRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly verifyPermissionService: VerifyPermissionService
  ) {}
  async execute(input: CreateCostCenterInputDTO) {
    const costCenter = CostCenter.create(
      input.name,
      input.workspaceId,
      input.code
    );

    const workspace = await this.workspaceRepository.retrieve(
      input.workspaceId
    );

    if (!workspace) {
      throw new FieldInvalid("workspace ID");
    }

    await this.verifyPermissionService.execute(input.userId, input.workspaceId);

    await this.costCenterRepository.save(costCenter);
  }
}

type CreateCostCenterInputDTO = {
  code?: string;
  name: string;
  workspaceId: string;
  userId: string;
};
