import type { AggregateOptions, Collection } from "mongodb";
import {
  type Document,
  type Filter,
  MongoClient,
  ServerApiVersion,
  type WithId,
} from "mongodb";
import config from "../config";

export interface DatabaseConnection<T = any> {
  insert(data: T): Promise<void>;
  query(query?: Filter<T>): Promise<WithId<T>[]>;
  update(query: Filter<T>, data: any): Promise<void>;
  delete(query?: Filter<T>): Promise<void>;
  setCollection(collectionName: string): void;
  aggregate(query: any[], options?: AggregateOptions): Promise<WithId<T>[]>;
}

const MongoDB = new MongoClient(config.get("mongodb.uri"), {
  serverApi: ServerApiVersion.v1,
});

MongoDB.connect();

const connection = MongoDB.db(
  process.env.NODE_ENV === "test"
    ? "budget-testing"
    : config.get("mongodb.database")
);

export class MongodbDatabaseConnection<T extends Document>
  implements DatabaseConnection<T>
{
  private collection: Collection<T>;

  setCollection(collectionName: string) {
    this.collection = connection.collection(collectionName);
  }

  async aggregate(
    query: T[],
    options?: AggregateOptions
  ): Promise<WithId<T>[]> {
    const result = await this.collection
      .aggregate<WithId<T>>(query, options)
      .toArray();
    return result;
  }

  async insert(data: any): Promise<void> {
    await this.collection.insertOne(data);
  }

  async query(query?: Filter<T>): Promise<WithId<T>[]> {
    return await this.collection?.find(query || {}).toArray();
  }

  async update(query: Filter<T>, data: any): Promise<void> {
    await this.collection.updateOne(query, { $set: data });
  }

  async delete(query?: Filter<T>): Promise<void> {
    await this.collection.deleteMany(query);
  }
}
