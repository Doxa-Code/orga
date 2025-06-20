import { createTool } from "@mastra/core";
import { OrgaSDK } from "../lib/orga-sdk";
import { retrieveProposalsFollowUpInputSchema } from "@orga/schemas/crm";

const orga = OrgaSDK.create();

export const retrieveFollowUps = createTool({
  id: "retrieve-followUps",
  description: "use para buscar as atualizações das propostas em andamento",
  inputSchema: retrieveProposalsFollowUpInputSchema,
  async execute({ context }) {
    return await orga.crm.followUps(context);
  },
});
