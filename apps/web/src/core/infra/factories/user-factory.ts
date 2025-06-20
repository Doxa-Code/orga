import { BankRepositoryDatabase } from "../../application/repositories/bank-repository";
import { UserRepositoryDatabase } from "../../application/repositories/user-repository";
import { WalletRepositoryDatabase } from "../../application/repositories/wallet-repository";
import { WorkspaceRepositoryDatabase } from "../../application/repositories/workspace-repository";
import { CreateCodeService } from "../../application/services/create-code-service";
import { VerifyPermissionService } from "../../application/services/verify-permission-service";
import { CreateUser } from "../../application/usecases/create-user";
import { CreateWallet } from "../../application/usecases/create-wallet";
import { DeleteAccountUser } from "../../application/usecases/delete-account-user";
import { RetrieveUser } from "../../application/usecases/retrieve-user";
import { RedisCacheDriver } from "../drivers/cache-driver";
import { JWTTokenCreatorDriver } from "../drivers/token-authenticate-creator";
import { AccountPlanFactory } from "./account-plan-factory";
import { SendMailFactory } from "./send-mail-factory";
import { WorkspaceFactory } from "./workspace-factory";

const userRepository = new UserRepositoryDatabase();

const cacheDriver = new RedisCacheDriver();

const sendMailService = SendMailFactory.sendMailService();

const populateAccountPlanService =
  AccountPlanFactory.populateAccountPlanService();

const deleteWorkspace = WorkspaceFactory.delete();
const createWorkspace = WorkspaceFactory.create();
const workspaceRepository = new WorkspaceRepositoryDatabase();

const walletRepository = new WalletRepositoryDatabase();

const bankRepository = new BankRepositoryDatabase();

export class UserFactory {
  static deleteAccountUser() {
    return new DeleteAccountUser(
      workspaceRepository as any,
      userRepository,
      deleteWorkspace
    );
  }

  static createUser() {
    return new CreateUser(
      userRepository,
      createWorkspace,
      populateAccountPlanService,
      new CreateWallet(walletRepository, bankRepository, workspaceRepository)
    );
  }

  static verifyPermissionService() {
    return new VerifyPermissionService(workspaceRepository as any);
  }

  static retrieveUser() {
    return new RetrieveUser(userRepository);
  }
}
