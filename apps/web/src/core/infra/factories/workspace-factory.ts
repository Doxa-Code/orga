import { AccountPlanRepositoryDatabase } from "../../application/repositories/account-plan-repository";
import { CostCenterRepositoryDatabase } from "../../application/repositories/cost-center-repository";
import { PartnerRepositoryDatabase } from "../../application/repositories/partner-repository";
import { TransactionRepositoryDatabase } from "../../application/repositories/transaction-repository";
import { UserRepositoryDatabase } from "../../application/repositories/user-repository";
import { WalletRepositoryDatabase } from "../../application/repositories/wallet-repository";
import { WorkspaceRepositoryDatabase } from "../../application/repositories/workspace-repository";
import { CreateWorkspace } from "../../application/usecases/create-workspace";
import { DeleteWorkspace } from "../../application/usecases/delete-workspace";

const workspaceRepository = new WorkspaceRepositoryDatabase();

const accountPlanRepository = new AccountPlanRepositoryDatabase();

const walletRepository = new WalletRepositoryDatabase();

const costCenterRepository = new CostCenterRepositoryDatabase();

const userRepository = new UserRepositoryDatabase();

const transactionsRepository = new TransactionRepositoryDatabase();

const partnerRepository = new PartnerRepositoryDatabase();

export class WorkspaceFactory {
  static delete() {
    return new DeleteWorkspace(
      workspaceRepository,
      accountPlanRepository,
      walletRepository,
      costCenterRepository,
      transactionsRepository,
      partnerRepository
    );
  }

  static create() {
    return new CreateWorkspace(workspaceRepository as any);
  }
}
