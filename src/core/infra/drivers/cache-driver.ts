import { Redis } from "ioredis";
import config from "../config";

interface CacheDriver {
  create(key: string, value: string): Promise<void>;
  retrieve(key: string): Promise<any>;
  delete(key: string): Promise<void>;
}

export class RedisCacheDriver implements CacheDriver {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.get("redis.uri"));
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async create(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
    await this.client.expire(key, 60);
  }

  async retrieve(key: string): Promise<any> {
    return await this.client.get(key);
  }
}
