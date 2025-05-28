"use server";

import { securityProcedure } from "@/app/actions/security-procedure";
import { PartnerFactory } from "@/core/infra/factories/partner-factory";
import { RetrievePartnerByTaxIdDAOFactory } from "@/core/infra/factories/retrieve-partner-by-tax-id-dao-factory";
import { ListPartnerLikeOptionPresentation } from "@/core/presenters/list-partner-like-option-presentation";
import { PrismaClient } from "@/generated/prisma";
import {
  listPartnersLikeOptionInputSchema,
  listPartnersOptionOutputSchema,
  listPartnersOutputSchema,
  registerPartnerFormSchema,
  retrievePartnerByTaxIdInputSchema,
  retrievePartnerByTaxIdOutputSchema,
} from "./schemas";

// 56.134.651/0001-29
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
    const createPartner = PartnerFactory.create();
    await createPartner
      .execute({
        name: input.name,
        roles: input.roles,
        type: input.type,
        workspaceId: workspace.id,
        address: input.address,
        email: input.email,
        phone: input.phone,
        taxId: input.taxId,
      })
      .catch((err) => console.log(err));
  });

export const retrievePartnerByTaxId = securityProcedure
  .input(retrievePartnerByTaxIdInputSchema)
  .output(retrievePartnerByTaxIdOutputSchema)
  .handler(async ({ input }) => {
    const response = await RetrievePartnerByTaxIdDAOFactory.create().retrieve(
      input.taxId,
    );

    if (!response) {
      return null;
    }

    return response;
  });

export const listPartners = securityProcedure
  .output(listPartnersOutputSchema)
  .handler(async ({ ctx: { workspace } }) => {
    const prisma = new PrismaClient();
    const response = await prisma.partner.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        address: true,
      },
    });
    return response;
  });
