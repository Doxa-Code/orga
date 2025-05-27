import type { Transaction } from "../../domain";
import type { AccountPlanRaw } from "../mappers/account-plan-mapper";
import type { CostCenterRaw } from "../mappers/cost-center-mapper";
import type { WorkspaceRaw } from "../mappers/workspace-mapper";

interface CostCenterRepository {
  list(workspaces: string[]): Promise<CostCenterRaw[]>;
}

interface AccountPlanRepository {
  list(workspaces: string[]): Promise<AccountPlanRaw[]>;
}

interface WorkspaceRepository {
  retrieveByOwner(ownerId: string): Promise<WorkspaceRaw[]>;
}

export class ListFinanceEntities {
  constructor(
    private readonly costCenterRepository: CostCenterRepository,
    private readonly accountPlanRepository: AccountPlanRepository,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}
  async execute(userId: string): Promise<ListFinanceEntitiesOutputDTO> {
    const workspaces = await this.workspaceRepository.retrieveByOwner(userId);

    const [costCenters, accountsPlan] = await Promise.all([
      this.costCenterRepository.list(workspaces.map((wk) => wk.id)),
      this.accountPlanRepository.list(workspaces.map((wk) => wk.id)),
    ]);

    return {
      costCenters,
      categories: accountsPlan.reduce<Category[]>((categories, account) => {
        return categories.concat(
          account.categories.map((category) => ({
            type: account.operation === "REVENUE" ? "CREDIT" : "DEBIT",
            sequence: category.sequence,
            name: `${category.sequence}. ${category.name}`,
          })),
        );
      }, []),
    };
  }
}

type Category = {
  type: Transaction.Type;
  sequence: string;
  name: string;
};

export type ListFinanceEntitiesOutputDTO = {
  costCenters: CostCenterRaw[];
  categories: Category[];
};
