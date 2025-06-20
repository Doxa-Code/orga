import { RetrievePartnerByTaxIdDAO } from "../../application/DAO/retrieve-partner-by-tax-id";
import { BrasilApiLoadExternalDataDriver } from "../drivers/load-external-data-driver";

export class RetrievePartnerByTaxIdDAOFactory {
  static create() {
    return new RetrievePartnerByTaxIdDAO(new BrasilApiLoadExternalDataDriver());
  }
}
