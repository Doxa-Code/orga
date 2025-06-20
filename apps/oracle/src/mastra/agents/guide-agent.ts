import { Agent } from "@mastra/core/agent";
import { azure } from "../llms/azure";
import { memoryWithVector } from "../memories";
import instructions from "../prompts/guide-prompt";
import { knowledgeBaseTool } from "../tools/knowledge-base-tool";
import { saveMemoryTool } from "../tools/save-memory";
import { clockTool } from "../tools/clock-tool";

export const guideAgent = new Agent({
  name: "Guide Agent",
  instructions,
  model: azure("gpt-4.1"),
  tools: { knowledgeBaseTool, saveMemoryTool, clockTool },
  memory: memoryWithVector,
});
