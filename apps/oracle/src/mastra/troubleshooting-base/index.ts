import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import * as fs from "node:fs";
import path from "node:path";
import { azureEmbeddings } from "../llms/azure";
import { pineconeVector } from "../vectors/pinecone-vector";

const files = ["docs/troubleshooting.md"];

const indexName = "oracle";

await pineconeVector.createIndex({
  indexName,
  dimension: 1536,
});

await Promise.all(
  files.map(async (filePath) => {
    const file = fs.readFileSync(path.join(__dirname, filePath));
    const doc = MDocument.fromMarkdown(file.toString());
    const chunks = await doc.chunk({
      strategy: "markdown",
      size: 400,
      overlap: 50,
      separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""],
    });
    const { embeddings } = await embedMany({
      model: azureEmbeddings.textEmbeddingModel("text-embedding-3-small", {
        dimensions: 1536,
      }),
      values: chunks.map((chunk) => chunk.text),
    });
    await pineconeVector.upsert({
      indexName,
      vectors: embeddings,
      metadata: chunks.map((chunk) => ({
        text: chunk.text,
      })),
    });
  })
);
