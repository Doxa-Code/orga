import { PineconeVector } from "@mastra/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export const pineconeVector = new PineconeVector({
  apiKey: process.env.PINECONE_API_KEY || "",
});

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ?? "",
});
