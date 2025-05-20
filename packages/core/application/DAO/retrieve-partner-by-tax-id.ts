import { Email, type Partner } from "../../domain";
import { Address } from "../../domain/valueobjects/address";
import { Phone } from "../../domain/valueobjects/phone";
import { TaxId } from "../../domain/valueobjects/taxid";

export type PartnerFinded = {
  address: {
    city: string;
    country: string;
    neighborhood: string;
    note: string;
    number: string;
    state: string;
    street: string;
    zipCode: string;
  };
  email: string;
  name: string;
  phone: string;
  taxId: string;
};

interface RetrievePartnerByTaxIdDriver {
  retrievePartnerByTaxId(taxid: string): Promise<PartnerFinded | null>;
}

export type PartnerRetrievedOutputDTO = {
  name: string;
  type: Partner.Type;
  address: Address;
  email: string;
  phone: string;
  taxId: string;
};

export class RetrievePartnerByTaxIdDAO {
  constructor(
    private readonly retrievePartnerByTaxIdDriver: RetrievePartnerByTaxIdDriver,
  ) {}

  async retrieve(taxid: string): Promise<PartnerRetrievedOutputDTO | null> {
    try {
      const response =
        await this.retrievePartnerByTaxIdDriver.retrievePartnerByTaxId(
          taxid.replace(/\D/gim, ""),
        );

      if (!response) {
        return null;
      }

      return {
        name: response.name,
        type: "COMPANY",
        address: Address.create(
          response.address.street,
          response.address.number,
          response.address.neighborhood,
          response.address.city,
          response.address.state,
          response.address.zipCode,
          response.address.country,
          response.address.note,
        ),
        email: Email.create(response.email).value,
        phone: Phone.create(response.phone).value,
        taxId: TaxId.create(response.taxId).value,
      } as PartnerRetrievedOutputDTO;
    } catch {
      return null;
    }
  }
}
