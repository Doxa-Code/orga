"use server";

import { ListAddressEntitiesDAOFactory } from "@/core/infra/factories/list-address-entities-dao-factory";
import { securityProcedure } from "../security-procedure";
import {
  listCitiesAddressInputSchema,
  listCitiesAddressOutputSchema,
  listStateAddressOutputSchema,
  loadCEPInputSchema,
  loadCEPOutputSchema,
} from "./schema";

export const listStates = securityProcedure
  .output(listStateAddressOutputSchema)
  .handler(async () => {
    const listAddressEntitiesDAO = ListAddressEntitiesDAOFactory.create();
    return await listAddressEntitiesDAO.listStates();
  });

export const listCities = securityProcedure
  .input(listCitiesAddressInputSchema)
  .output(listCitiesAddressOutputSchema)
  .handler(async ({ input }) => {
    const listAddressEntitiesDAO = ListAddressEntitiesDAOFactory.create();
    if (!input.acronym) {
      return [];
    }
    return await listAddressEntitiesDAO.retrieveCities(input.acronym);
  });

export const loadAddressZipCode = securityProcedure
  .input(loadCEPInputSchema)
  .output(loadCEPOutputSchema)
  .handler(async ({ input }) => {
    const listAddressEntitiesDAO = ListAddressEntitiesDAOFactory.create();
    const response = await listAddressEntitiesDAO.retrieveAddressByZipCode(
      input.zipCode
    );
    return response;
  });
