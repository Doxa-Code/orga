import { PostgresStore } from "@mastra/pg";

export const postgresStore = new PostgresStore({
  connectionString: process.env.POSTGRES_URL ?? "",
  schemaName: "oracle",
});
