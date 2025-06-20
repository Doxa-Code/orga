import { createTool } from "@mastra/core";
import { OrgaSDK } from "../lib/orga-sdk";
import {
  createAppointmentInputSchema,
  removeAppointmentInputSchema,
  retrieveAppointmentInputSchema,
  updateAppointmentInputSchema,
} from "@orga/schemas/appointments";

const orga = OrgaSDK.create();

export const createAppointmentTool = createTool({
  id: "create-appointment",
  description: "use para criar eventos na agenda",
  inputSchema: createAppointmentInputSchema,
  async execute({ context }) {
    await orga.appointments.create({
      createdBy: context.createdBy,
      description: context.description,
      scheduledAt: context.scheduledAt,
    });

    return "Agendamento criado com sucesso";
  },
});

export const retrieveAppointmentTool = createTool({
  id: "retrieve-appointment",
  description: "use para buscar eventos de uma data na agenda",
  inputSchema: retrieveAppointmentInputSchema,
  async execute({ context }) {
    return await orga.appointments.retrieve(context.start, context.end);
  },
});

export const updateAppointment = createTool({
  id: "update-appointment",
  description: "use para atualizar eventos da agenda",
  inputSchema: updateAppointmentInputSchema,
  async execute({ context }) {
    await orga.appointments.update(context);
    return "Atualizado com sucesso";
  },
});

export const removeAppointment = createTool({
  id: "remove-appointment",
  description: "use para remover eventos da agenda",
  inputSchema: removeAppointmentInputSchema,
  async execute({ context }) {
    await orga.appointments.remove(context.id);
    return "Removido com sucesso";
  },
});
