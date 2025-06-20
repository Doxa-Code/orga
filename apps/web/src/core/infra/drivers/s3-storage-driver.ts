import type { Readable } from "node:stream";
import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../config";

interface StorageDriver {
  assigneeImage(bucketName: string, key: string): Promise<string>;
  fileExists(bucketName: string, key: string): Promise<boolean>;
  upload(bucketName: string, key: string, buffer: Readable): Promise<void>;
}

export class S3StorageDriver implements StorageDriver {
  private readonly s3 = new S3Client({
    forcePathStyle: true,
    region: "sa-east-1",
    endpoint: config.get("aws.endpoint") || undefined,
  });

  async upload(bucketName: string, key: string, body: Readable): Promise<void> {
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: body,
      },
    });

    await upload.done();
  }

  async fileExists(bucketName: string, key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await this.s3.send(command);
      return true;
    } catch {
      return false;
    }
  }

  async assigneeImage(bucketName: string, key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const result = await getSignedUrl(this.s3, command, { expiresIn: 1800 });

    return result;
  }
}
