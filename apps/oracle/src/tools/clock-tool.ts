import { createTool } from "@mastra/core";

export const clockTool = createTool({
  description: "Use esta ferramenta para obter a hora atual",
  id: "clock",
  execute: async () => {
    const now = new Date();
    return `A hora atual é ${now.toLocaleString("pt-BR")}`;
  },
});
