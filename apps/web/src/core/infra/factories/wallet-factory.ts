import { BankRepositoryDatabase } from "../../application/repositories/bank-repository";
import { WalletRepositoryDatabase } from "../../application/repositories/wallet-repository";
import { WorkspaceRepositoryDatabase } from "../../application/repositories/workspace-repository";
import { ExternalImageStorageService } from "../../application/services/external-image-storage-service";
import { CreateWallet } from "../../application/usecases/create-wallet";
import { DeleteWallet } from "../../application/usecases/delete-wallet";
import { EditWallet } from "../../application/usecases/edit-wallet";
import { ListWallets } from "../../application/usecases/list-wallets";
import { RetrieveWallet } from "../../application/usecases/retrieve-wallet";
import { RetrieveWalletTransactionHistory } from "../../application/usecases/retrieve-wallet-transaction-history";
import { S3StorageDriver } from "../drivers/s3-storage-driver";
import { UserFactory } from "./user-factory";

const walletRepository = new WalletRepositoryDatabase();
const bankRepository = new BankRepositoryDatabase();
const workspaceRepository = new WorkspaceRepositoryDatabase();
const imageStorage = new ExternalImageStorageService(new S3StorageDriver());

const verifyPermissionService = UserFactory.verifyPermissionService();

export class WalletFactory {
  static list() {
    return new ListWallets(
      walletRepository,
      imageStorage,
      workspaceRepository as any
    );
  }

  static delete() {
    return new DeleteWallet(walletRepository, verifyPermissionService);
  }

  static create() {
    return new CreateWallet(
      walletRepository,
      bankRepository,
      workspaceRepository as any
    );
  }

  static edit() {
    return new EditWallet(
      walletRepository,
      bankRepository,
      verifyPermissionService
    );
  }

  static retrieve() {
    return new RetrieveWallet(walletRepository, verifyPermissionService);
  }

  static retrieveTransactionHistory() {
    return new RetrieveWalletTransactionHistory(
      verifyPermissionService,
      walletRepository,
      imageStorage
    );
  }
}
