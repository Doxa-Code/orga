"use server";

import { securityProcedure } from "@/app/actions/security-procedure";
import { PartnerFactory } from "@/core/infra/factories/partner-factory";
import { RetrievePartnerByTaxIdDAOFactory } from "@/core/infra/factories/retrieve-partner-by-tax-id-dao-factory";
import { ListPartnerLikeOptionPresentation } from "@/core/presenters/list-partner-like-option-presentation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  listPartnersLikeOptionInputSchema,
  listPartnersOptionOutputSchema,
  listPartnersOutputSchema,
  partnerSchema,
  registerPartnerFormSchema,
  retrievePartnerByTaxIdInputSchema,
  retrievePartnerByTaxIdOutputSchema,
  retrievePartnerInputSchema,
  searchPartnersInputSchema,
} from "./schemas";
import { prisma } from "@/lib/prisma";

export const listPartnersLikeOption = securityProcedure
  .input(listPartnersLikeOptionInputSchema)
  .output(listPartnersOptionOutputSchema)
  .handler(async ({ input, ctx: { workspace } }) => {
    const listPartners = PartnerFactory.list();
    const partners = await listPartners.execute(workspace.id, input.type);
    return ListPartnerLikeOptionPresentation.create(partners);
  });

export const registerPartner = securityProcedure
  .input(registerPartnerFormSchema)
  .handler(async ({ input, ctx: { workspace } }) => {
    if (!input.id) {
      const createPartner = PartnerFactory.create();
      await createPartner.execute({
        name: input.name,
        roles: input.roles,
        type: input.type,
        workspaceId: workspace.id,
        address: input.address,
        email: input.email,
        phone: input.phone,
        taxId: input.taxId,
        contacts: input.contacts.map((contact) => ({
          ...contact,
          phone: contact.phone ?? "",
        })),
      });
      return revalidatePath("/partners", "page");
    }
    await prisma.partner.update({
      data: {
        address: {
          upsert: {
            create: input.address,
            update: input.address,
            where: input.address,
          },
        },
        email: input.email,
        name: input.name,
        phone: input.phone,
        roles: input.roles,
        taxId: input.taxId,
        type: input.type,
        contacts: {
          upsert: input.contacts.map((contact) => ({
            create: {
              id: contact.id,
              name: contact.name,
              phone: contact.phone ?? "",
            },
            update: {
              name: contact.name,
              phone: contact.phone ?? "",
            },
            where: {
              id: contact.id,
            },
          })),
        },
      },
      where: {
        id: input.id,
      },
    });
    return revalidatePath("/partners", "page");
  });

export const retrievePartnerByTaxId = securityProcedure
  .input(retrievePartnerByTaxIdInputSchema)
  .output(retrievePartnerByTaxIdOutputSchema)
  .handler(async ({ input }) => {
    const response = await RetrievePartnerByTaxIdDAOFactory.create().retrieve(
      input.taxId
    );

    if (!response) {
      return null;
    }

    return response;
  });

export const retrievePartner = securityProcedure
  .input(retrievePartnerInputSchema)
  .output(partnerSchema.nullish())
  .handler(async ({ input, ctx: { workspace } }) => {
    const partner = await prisma.partner.findFirst({
      where: {
        AND: [
          {
            workspaceId: workspace.id,
          },
          {
            id: input.id,
          },
        ],
      },
      include: {
        address: true,
        contacts: true,
      },
    });
    if (!partner) return null;
    return partner;
  });

export const listPartners = securityProcedure
  .output(listPartnersOutputSchema)
  .handler(async ({ ctx: { workspace } }) => {
    const response = await prisma.partner.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        address: true,
        contacts: true,
      },
    });

    return response;
  });

export const toggleStatusPartner = securityProcedure
  .input(z.object({ partnerId: z.string() }))
  .handler(async ({ ctx: { workspace }, input: { partnerId } }) => {
    const partner = await prisma.partner.findFirst({
      where: {
        AND: [
          {
            workspaceId: workspace.id,
          },
          {
            id: partnerId,
          },
        ],
      },
    });
    if (!partner) return;

    await prisma.partner.update({
      data: {
        status: partner.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      },
      where: {
        id: partnerId,
      },
    });
    revalidatePath("/partners", "page");
  });

export const removePartner = securityProcedure
  .input(z.object({ partnerIds: z.array(z.string()) }))
  .handler(async ({ input: { partnerIds }, ctx: { workspace } }) => {
    await prisma.partner.deleteMany({
      where: {
        AND: [
          {
            workspaceId: workspace.id,
          },
          {
            id: {
              in: partnerIds,
            },
          },
        ],
      },
    });
    revalidatePath("/partners", "page");
  });

export const searchPartners = securityProcedure
  .input(searchPartnersInputSchema)
  .output(listPartnersOutputSchema)
  .handler(async ({ input, ctx: { workspace } }) => {
    const search = input.search.trim();
    if (search.length < 3) return [];

    const response = await prisma.partner.findMany({
      where: {
        workspaceId: workspace.id,
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      include: {
        address: true,
        contacts: true,
      },
      take: 10,
    });
    return response;
  });
