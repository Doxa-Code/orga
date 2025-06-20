import { BankRepositoryDatabase } from "../../application/repositories/bank-repository";
import { ExternalImageStorageService } from "../../application/services/external-image-storage-service";
import { CreateBank } from "../../application/usecases/create-bank";
import { ListBank } from "../../application/usecases/list-bank";
import { S3StorageDriver } from "../drivers/s3-storage-driver";

const bankRepository = new BankRepositoryDatabase();
const imageStorage = new ExternalImageStorageService(new S3StorageDriver());

export class BankFactory {
  static create() {
    return new CreateBank(bankRepository, imageStorage);
  }

  static list() {
    return new ListBank(bankRepository, imageStorage);
  }
}
