import type { Readable } from "node:stream";
import config from "../../infra/config";

interface ImageStorageService {
  assigneeImage(key: string): Promise<string>;
  upload(key: string, buffer: Readable): Promise<void>;
}

interface ExternalImageStorageServiceStorageDriver {
  assigneeImage(bucketName: string, key: string): Promise<string>;
  fileExists(bucketName: string, key: string): Promise<boolean>;
  upload(bucketName: string, key: string, buffer: Readable): Promise<void>;
}

export class ExternalImageStorageService implements ImageStorageService {
  private readonly bucketName = config.get("aws.storage.name");

  constructor(
    private readonly storageDriver: ExternalImageStorageServiceStorageDriver,
  ) {}

  async assigneeImage(key: string): Promise<string> {
    return await this.storageDriver.assigneeImage(this.bucketName, key);
  }

  async upload(key: string, buffer: Readable): Promise<void> {
    if (await this.storageDriver.fileExists(this.bucketName, key)) {
      return;
    }
    await this.storageDriver.upload(this.bucketName, key, buffer);
  }
}
