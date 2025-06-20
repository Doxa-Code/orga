import { BrasilApiLoadExternalDataDriver } from "../../infra/drivers/load-external-data-driver";
import { RetrievePartnerByTaxIdDAO } from "./retrieve-partner-by-tax-id";

const retrievePartnerByTaxIdDAO = new RetrievePartnerByTaxIdDAO(
  new BrasilApiLoadExternalDataDriver(),
);

test("retrieve partner", async () => {
  const response =
    await retrievePartnerByTaxIdDAO.retrieve("00.000.000/0001-91");

  expect(response).toBeDefined();
});
