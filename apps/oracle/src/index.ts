import { Mastra } from "@mastra/core";
import { PinoLogger } from "@mastra/loggers";
import { guideAgent } from "./agents/guide-agent";
import { pineconeVector } from "./vectors/pinecone-vector";

export const mastra = new Mastra({
  agents: { guideAgent },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  vectors: {
    pinecone: pineconeVector,
  },
  telemetry: {
    enabled: true,
  },
});
