import { createTool } from "@mastra/core";
import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { z } from "zod";
import { azureEmbeddings } from "../llms/azure";
import { pineconeVector } from "../vectors/pinecone-vector";

export const saveMemoryTool = createTool({
  description: "Use essa ferramenta para salvar informações importantes",
  id: "save-memory",
  inputSchema: z.object({
    memory: z.string().describe("A memória a ser salva"),
    chunkSize: z.number().describe("O tamanho dos chunks"),
    overlap: z.number().describe("A sobreposição dos chunks"),
  }),
  outputSchema: z.string(),
  execute: async ({ context }) => {
    const doc = MDocument.fromText(context.memory);

    const chunks = await doc.chunk({
      strategy: "markdown",
      size: context.chunkSize,
      overlap: context.overlap,
      separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""],
    });

    const { embeddings } = await embedMany({
      model: azureEmbeddings.textEmbeddingModel("text-embedding-3-small", {
        dimensions: 1536,
      }),
      values: chunks.map((chunk) => chunk.text),
    });

    await pineconeVector.upsert({
      indexName: "oracle",
      vectors: embeddings,
      metadata: chunks.map((chunk) => ({
        text: chunk.text,
      })),
    });

    return "Memória salva com sucesso";
  },
});
