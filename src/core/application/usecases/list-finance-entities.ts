import { CostCenter } from "@/core/domain/entities/cost-center";
import { AccountPlan } from "@/core/domain/entities/account-plan";
import { Workspace } from "@/core/domain/entities/workspace";
import { Transaction } from "@/core/domain/entities/transaction";

interface CostCenterRepository {
  list(workspaces: string[]): Promise<CostCenter[]>;
}

interface AccountPlanRepository {
  list(workspaces: string[]): Promise<AccountPlan[]>;
}

interface WorkspaceRepository {
  retrieveByOwner(ownerId: string): Promise<Workspace[]>;
}

export class ListFinanceEntities {
  constructor(
    private readonly costCenterRepository: CostCenterRepository,
    private readonly accountPlanRepository: AccountPlanRepository,
    private readonly workspaceRepository: WorkspaceRepository
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
          }))
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
  costCenters: CostCenter[];
  categories: Category[];
};
