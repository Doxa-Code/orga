import { AccountPlanRepositoryDatabase } from "../../application/repositories/account-plan-repository";
import { CostCenterRepositoryDatabase } from "../../application/repositories/cost-center-repository";
import { WorkspaceRepositoryDatabase } from "../../application/repositories/workspace-repository";
import { ListFinanceEntities } from "../../application/usecases/list-finance-entities";

const costCenterRepository = new CostCenterRepositoryDatabase();

const accountsPlanRepository = new AccountPlanRepositoryDatabase();

const workspaceRepository = new WorkspaceRepositoryDatabase();

export class FinanceFactory {
  static listEntities() {
    return new ListFinanceEntities(
      costCenterRepository,
      accountsPlanRepository,
      workspaceRepository as any
    );
  }
}
