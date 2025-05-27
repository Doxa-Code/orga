import { z } from "zod";

const USER_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  plan: z.string(),
  active: z.boolean(),
  createdAt: z.string(),
});

const WORKSPACE_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  cnpj: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  owner: z.string(),
  participants: z.array(z.string()),
});

export const createCodeInputSchema = z.object({
  email: z.string({ message: "Email inválido" }),
});

export const authenticateUserInputSchema = z.object({
  email: z.string(),
  code: z.string(),
  ip: z.string(),
});

export const getPayloadOutputSchema = z.object({
  token: z.string(),
  payload: z.object({
    user: USER_SCHEMA,
    workspaces: z.array(WORKSPACE_SCHEMA),
  }),
});
