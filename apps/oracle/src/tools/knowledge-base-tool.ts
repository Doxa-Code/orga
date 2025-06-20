import { createVectorQueryTool } from "@mastra/rag";
import { azureEmbeddings } from "../llms/azure";

export const knowledgeBaseTool = createVectorQueryTool({
  vectorStoreName: "pinecone",
  description:
    "use essa ferramenta para buscar informações na base de conhecimento",
  indexName: "oracle",
  model: azureEmbeddings.textEmbeddingModel("text-embedding-3-small", {
    dimensions: 1536,
  }),
});
