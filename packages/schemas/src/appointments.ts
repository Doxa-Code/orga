import { z } from "zod";

export const createAppointmentInputSchema = z.object({
  description: z.string(),
  scheduledAt: z.string(),
  createdBy: z
    .string()
    .describe("Nome do usuario que está criando esse agendamento"),
});

export const retrieveAppointmentInputSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const updateAppointmentInputSchema = z.object({
  id: z.string().describe("id do agendamento uuid"),
  description: z.string().optional(),
  scheduledAt: z.string().optional(),
  createdBy: z
    .string()
    .optional()
    .describe("Nome do usuario que está criando esse agendamento"),
});

export const removeAppointmentInputSchema = z.object({
  id: z.string(),
});
