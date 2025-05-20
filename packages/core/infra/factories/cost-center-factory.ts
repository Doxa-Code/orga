import { CostCenterRepositoryDatabase } from "../../application/repositories/cost-center-repository";
import { WorkspaceRepositoryDatabase } from "../../application/repositories/workspace-repository";
import { CreateCostCenter } from "../../application/usecases/create-cost-center";
import { ListCostCenter } from "../../application/usecases/list-cost-center";
import { UserFactory } from "./user-factory";

const costCenterRepository = new CostCenterRepositoryDatabase();

const workspaceRepository = new WorkspaceRepositoryDatabase();

const verifyPermissionService = UserFactory.verifyPermissionService();

export class CostCenterFactory {
  static create() {
    return new CreateCostCenter(
      costCenterRepository,
      workspaceRepository,
      verifyPermissionService,
    );
  }

  static list() {
    return new ListCostCenter(
      costCenterRepository,
      workspaceRepository,
      verifyPermissionService,
    );
  }
}
