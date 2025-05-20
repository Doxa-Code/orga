"use server";

import {
  PartnerFactory,
  RetrievePartnerByTaxIdDAOFactory,
} from "@orga/core/factories";
import { ListPartnerLikeOptionPresentation } from "@orgapresenters";
import { securityProcedure } from "../security-procedure";
import {
  listPartnersLikeOptionInputSchema,
  listPartnersOptionOutputSchema,
  registerPartnerFormSchema,
  retrievePartnerByTaxIdInputSchema,
  retrievePartnerByTaxIdOutputSchema,
} from "./schema";

export const listPartnersLikeOption = securityProcedure
  .input(listPartnersLikeOptionInputSchema)
  .output(listPartnersOptionOutputSchema)
  .handler(async ({ input, ctx: { payload } }) => {
    const listPartners = PartnerFactory.list();
    const partners = await listPartners.execute(
      payload.workspaces[0]!.id,
      input.type,
    );
    return ListPartnerLikeOptionPresentation.create(partners);
  });

export const registerPartner = securityProcedure
  .input(registerPartnerFormSchema)
  .handler(async ({ input, ctx: { payload } }) => {
    const createPartner = PartnerFactory.create();
    await createPartner.execute({
      name: input.name,
      roles: input.roles,
      type: input.type,
      workspaceId: payload.workspaces[0]?.id!,
      address: input.address,
      email: input.email,
      phone: input.phone,
      taxId: input.taxId,
    });
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
