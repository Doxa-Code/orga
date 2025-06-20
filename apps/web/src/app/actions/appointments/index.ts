import { Appointment } from "@/core/domain/entities/appointment";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createServerAction } from "zsa";

export const createAppointment = createServerAction()
  .input(
    z.object({
      description: z.string(),
      scheduledAt: z.date(),
      createdBy: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const appointment = Appointment.create({
      createdBy: input.createdBy,
      description: input.description,
      scheduledAt: input.scheduledAt,
    });

    await prisma.appointment.create({
      data: appointment,
    });

    return appointment;
  });
