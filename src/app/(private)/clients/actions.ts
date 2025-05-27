"use server";
import { PrismaClient } from "@/generated/prisma";
import { createServerAction } from "zsa";

export const listClients = createServerAction().handler(async () => {
  const prisma = new PrismaClient();
  const response = await prisma.partner.findMany({
    where: {
      roles: {
        has: "CUSTOMER",
      },
    },
  });
  return response;
});
