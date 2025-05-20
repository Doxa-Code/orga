import { Partner } from "../../domain/entities/partner";
import { Address } from "../../domain/valueobjects/address";
import { Email } from "../../domain/valueobjects/email";
import { Phone } from "../../domain/valueobjects/phone";
import { TaxId } from "../../domain/valueobjects/taxid";

export interface PartnerRaw {
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    note: string;
  };
  id: string;
  type: Partner.Type;
  roles: Partner.Role[];
  name: string;
  taxId: string;
  email: string;
  phone: string;
  status: Partner.Status;
  createdAt: Date;
  workspaceId: string;
}

export class PartnerMapper {
  static toDomain(partner: PartnerRaw): Partner {
    return new Partner({
      address: Address.create(
        partner.address.street,
        partner.address.number,
        partner.address.neighborhood,
        partner.address.city,
        partner.address.state,
        partner.address.zipCode,
        partner.address.country,
        partner.address.note,
      ),
      createdAt: partner.createdAt,
      email: Email.create(partner.email),
      id: partner.id,
      name: partner.name,
      phone: Phone.create(partner.phone),
      roles: partner.roles,
      status: partner.status,
      taxId: TaxId.create(partner.taxId),
      type: partner.type,
      workspaceId: partner.workspaceId,
    });
  }

  static toPersist(partner: Partner): PartnerRaw {
    return {
      address: {
        city: partner.address.city,
        country: partner.address.country,
        neighborhood: partner.address.neighborhood,
        note: partner.address.note,
        number: partner.address.number,
        state: partner.address.state,
        street: partner.address.street,
        zipCode: partner.address.zipCode,
      },
      createdAt: partner.createdAt,
      email: partner.email.value,
      id: partner.id,
      name: partner.name,
      phone: partner.phone.value,
      roles: partner.roles,
      status: partner.status,
      taxId: partner.taxId.value,
      type: partner.type,
      workspaceId: partner.workspaceId,
    };
  }
}
