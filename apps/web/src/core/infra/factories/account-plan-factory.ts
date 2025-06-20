import { AccountPlanRepositoryDatabase } from "../../application/repositories/account-plan-repository";
import { PopulateAccountPlanService } from "../../application/services/populate-account-plan-service";

const accountPlanRepository = new AccountPlanRepositoryDatabase();

export class AccountPlanFactory {
  static populateAccountPlanService() {
    return new PopulateAccountPlanService(accountPlanRepository);
  }
}
