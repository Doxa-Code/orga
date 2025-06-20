import { Memory } from "@mastra/memory";
import { azureEmbeddings } from "./llms/azure";
import { pineconeVector } from "./vectors/pinecone-vector";
import { postgresStore } from "./store/postgres-store";

export const memoryWithVector = new Memory({
  embedder: azureEmbeddings.textEmbeddingModel("text-embedding-3-small"),
  vector: pineconeVector,
  storage: postgresStore,
});
