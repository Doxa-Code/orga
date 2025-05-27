"use server";

import { PartnerFactory } from "@/core/infra/factories/partner-factory";
import { RetrievePartnerByTaxIdDAOFactory } from "@/core/infra/factories/retrieve-partner-by-tax-id-dao-factory";
import { ListPartnerLikeOptionPresentation } from "@/core/presenters/list-partner-like-option-presentation";
import { securityProcedure } from "../security-procedure";
import {
	listPartnersLikeOptionInputSchema,
	listPartnersOptionOutputSchema,
	registerPartnerFormSchema,
	retrievePartnerByTaxIdInputSchema,
	retrievePartnerByTaxIdOutputSchema,
} from "./schema";

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
		await createPartner.execute({
			name: input.name,
			roles: input.roles,
			type: input.type,
			workspaceId: workspace.id,
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
