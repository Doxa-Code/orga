import { Appointment } from "@/core/domain/entities/appointment";
import { prisma } from "@/lib/prisma";
import {
  createAppointmentInputSchema,
  removeAppointmentInputSchema,
  retrieveAppointmentInputSchema,
  updateAppointmentInputSchema,
} from "@orga/schemas/appointments";
import { createServerAction } from "zsa";

export const createAppointment = createServerAction()
  .input(createAppointmentInputSchema)
  .handler(async ({ input }) => {
    const appointment = Appointment.create({
      createdBy: input.createdBy,
      description: input.description,
      scheduledAt: new Date(input.scheduledAt),
    });

    await prisma.appointment.create({
      data: appointment,
    });

    return appointment;
  });

export const retrieveAppointment = createServerAction()
  .input(retrieveAppointmentInputSchema)
  .handler(async ({ input }) => {
    const start = new Date(input.start);
    const end = new Date(input.end);

    return await prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: start,
          lt: end,
        },
      },
    });
  });

export const updateAppointment = createServerAction()
  .input(updateAppointmentInputSchema)
  .handler(async ({ input }) => {
    await prisma.appointment.update({
      where: {
        id: input.id,
      },
      data: {
        createdBy: input.createdBy ?? undefined,
        description: input.description ?? undefined,
        scheduledAt: input.scheduledAt
          ? new Date(input.scheduledAt)
          : undefined,
      },
    });
  });

export const removeAppointment = createServerAction()
  .input(removeAppointmentInputSchema)
  .handler(async ({ input }) => {
    await prisma.appointment.delete({
      where: {
        id: input.id,
      },
    });
  });
