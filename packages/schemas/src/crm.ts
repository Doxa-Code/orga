import { z } from "zod";

export const retrieveProposalsFollowUpInputSchema = z.object({
  start: z.string().describe("o formato deve ser yyyy-MM-ddTHH:mm:ss"),
  end: z.string().describe("o formato deve ser yyyy-MM-ddTHH:mm:ss"),
  stage: z.string().describe("status da proposta").optional(),
});
