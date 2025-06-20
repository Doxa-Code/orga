import { AccountPlanRepositoryDatabase } from "../../application/repositories/account-plan-repository";
import { CostCenterRepositoryDatabase } from "../../application/repositories/cost-center-repository";
import { PartnerRepositoryDatabase } from "../../application/repositories/partner-repository";
import { TransactionRepositoryDatabase } from "../../application/repositories/transaction-repository";
import { UserRepositoryDatabase } from "../../application/repositories/user-repository";
import { WalletRepositoryDatabase } from "../../application/repositories/wallet-repository";
import { WorkspaceRepositoryDatabase } from "../../application/repositories/workspace-repository";
import { ExternalImageStorageService } from "../../application/services/external-image-storage-service";
import { CreateTransaction } from "../../application/usecases/create-transaction";
import { DeleteTransaction } from "../../application/usecases/delete-transaction";
import { EditTransaction } from "../../application/usecases/edit-transaction";
import { MakePaymentOnTransaction } from "../../application/usecases/make-payment-on-transaction";
import { RetrieveTransaction } from "../../application/usecases/retrieve-transaction";
import { SearchTransactions } from "../../application/usecases/search-transactions";
import { RegisterTransactionOnWallet } from "../../domain/services/register-transaction-on-wallet";
import { S3StorageDriver } from "../drivers/s3-storage-driver";
import { UserFactory } from "./user-factory";

const transactionRepository = new TransactionRepositoryDatabase();

const costCenterRepository = new CostCenterRepositoryDatabase();

const accountPlanRepository = new AccountPlanRepositoryDatabase();

const workspaceRepository = new WorkspaceRepositoryDatabase();

const userRepository = new UserRepositoryDatabase();

const walletRepository = new WalletRepositoryDatabase();

const partnersRepository = new PartnerRepositoryDatabase();

const verifyPermissionService = UserFactory.verifyPermissionService();

const registerTransactionOnWalletService = new RegisterTransactionOnWallet(
  walletRepository as any
);

const imageStorage = new ExternalImageStorageService(new S3StorageDriver());

export class TransactionFactory {
  static delete() {
    return new DeleteTransaction(
      verifyPermissionService,
      transactionRepository,
      registerTransactionOnWalletService
    );
  }

  static edit() {
    return new EditTransaction(
      transactionRepository,
      costCenterRepository,
      accountPlanRepository,
      registerTransactionOnWalletService,
      walletRepository
    );
  }

  static searchTransactions() {
    return new SearchTransactions(
      transactionRepository,
      userRepository,
      workspaceRepository as any,
      partnersRepository,
      walletRepository,
      imageStorage
    );
  }

  static create() {
    return new CreateTransaction(
      workspaceRepository,
      accountPlanRepository,
      costCenterRepository,
      transactionRepository,
      verifyPermissionService,
      registerTransactionOnWalletService
    );
  }

  static retrieve() {
    return new RetrieveTransaction(
      transactionRepository,
      verifyPermissionService
    );
  }

  static makePaymentOnTransaction() {
    return new MakePaymentOnTransaction(
      transactionRepository,
      verifyPermissionService,
      registerTransactionOnWalletService
    );
  }
}
