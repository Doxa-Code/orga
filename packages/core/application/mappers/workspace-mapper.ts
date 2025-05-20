import { Address } from "../../domain";
import { Workspace } from "../../domain/entities/workspace";
import { Email } from "../../domain/valueobjects/email";
import { Phone } from "../../domain/valueobjects/phone";
import { TaxId } from "../../domain/valueobjects/taxid";

export interface WorkspaceRaw {
  id: string;
  name: string;
  cnpj: string;
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
  phone: string;
  email: string;
}

export class WorkspaceMapper {
  static toPersist(input: Workspace): WorkspaceRaw {
    return {
      address: {
        city: input.address.city,
        country: input.address.country,
        neighborhood: input.address.neighborhood,
        note: input.address.note,
        number: input.address.number,
        state: input.address.state,
        street: input.address.street,
        zipCode: input.address.zipCode,
      },
      cnpj: input.cnpj.value,
      email: input.email.value,
      id: input.id,
      name: input.name,
      phone: input.phone.value,
    };
  }

  static toDomain(input: WorkspaceRaw): Workspace {
    return new Workspace({
      address: Address.create(
        input.address.street,
        input.address.number,
        input.address.neighborhood,
        input.address.city,
        input.address.state,
        input.address.zipCode,
        input.address.country,
        input.address.note,
      ),
      cnpj: TaxId.create(input.cnpj),
      email: Email.create(input.email),
      id: input.id,
      name: input.name,
      phone: Phone.create(input.phone),
    });
  }
}
