import type { CostCenter } from "../../domain/entities/cost-center";

export interface CostCenterRaw {
  id: string;
  code: string;
  name: string;
  workspaceId: string;
}

export class CostCenterMapper {
  static toPersist(costCenter: CostCenter): CostCenterRaw {
    return {
      code: costCenter.code,
      id: costCenter.id,
      name: costCenter.name,
      workspaceId: costCenter.workspaceId,
    };
  }
}
