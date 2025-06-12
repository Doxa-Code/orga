import { FieldInvalid } from "../errors/field-invalid";
import { FieldMissing } from "../errors/field-missing";
import { Address } from "../valueobjects/address";
import { Email } from "../valueobjects/email";
import { Phone } from "../valueobjects/phone";
import { TaxId } from "../valueobjects/taxid";
import { Contact } from "./contact";

export namespace Partner {
  export type Type = "INDIVIDUAL" | "COMPANY";

  export type Role = "CUSTOMER" | "SUPPLIER";

  export type Status = "ACTIVE" | "INACTIVE";
  export interface Props {
    id: string;
    type: Type;
    roles: Role[];
    name: string;
    taxId: TaxId;
    email: Email;
    phone: Phone;
    address: Address;
    status: Status;
    createdAt: Date;
    workspaceId: string;
    contacts: Contact[];
  }

  export interface Raw {
    id: string;
    type: Type;
    roles: Role[];
    name: string;
    taxId: string;
    email: string;
    phone: string;
    address: {
      street?: string | null;
      neighborhood?: string | null;
      number?: string | null;
      city?: string | null;
      state?: string | null;
      zipCode?: string | null;
      country?: string | null;
      note?: string | null;
    };
    status: Status;
    createdAt: Date;
    workspaceId: string;
    contacts: {
      id: string;
      name: string;
      phone: string;
    }[];
  }
}

type CreatePartnerInputDTO = {
  type: Partner.Type;
  roles: Partner.Role[];
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    neighborhood?: string;
    number?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    note?: string;
  };
  workspaceId: string;
};

export class Partner {
  public id: string;
  public type: Partner.Type;
  public roles: Partner.Role[];
  public name: string;
  public taxId: TaxId;
  public email: Email;
  public phone: Phone;
  public address: Address;
  public status: Partner.Status;
  public createdAt: Date;
  public workspaceId: string;
  public contacts: Contact[];

  constructor(props: Partner.Props) {
    this.id = props.id;
    this.type = props.type;
    this.roles = props.roles;
    this.name = props.name;
    this.taxId = props.taxId;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.workspaceId = props.workspaceId;
    this.contacts = props.contacts;
  }

  raw(): Partner.Raw {
    return {
      id: this.id,
      name: this.name,
      taxId: this.taxId.value,
      type: this.type,
      roles: this.roles,
      email: this.email.value,
      phone: this.phone.value,
      address: this.address.raw(),
      status: this.status,
      createdAt: this.createdAt,
      workspaceId: this.workspaceId,
      contacts: this.contacts.map((contact) => contact.raw()),
    };
  }

  static fromRaw(props: Partner.Raw) {
    return new Partner({
      address: Address.create({
        street: props.address.street ?? null,
        neighborhood: props.address.neighborhood ?? null,
        number: props.address.number ?? null,
        city: props.address.city ?? null,
        state: props.address.state ?? null,
        zipCode: props.address.zipCode ?? null,
        country: props.address.country ?? null,
        note: props.address.note ?? null,
      }),
      taxId: TaxId.create(props.taxId),
      createdAt: new Date(props.createdAt),
      email: Email.create(props.email),
      id: props.id,
      name: props.name,
      phone: Phone.create(props.phone),
      roles: props.roles,
      status: props.status,
      type: props.type,
      workspaceId: props.workspaceId,
      contacts: props.contacts.map((contact) =>
        Contact.create(contact.name, contact.phone)
      ),
    });
  }

  setContacts(contacts: Contact[]) {
    this.contacts = contacts;
  }

  static instance(props: Partner.Props) {
    return new Partner(props);
  }

  static create(input: CreatePartnerInputDTO) {
    if (!input.workspaceId) {
      throw new FieldMissing("workspace ID");
    }

    if (!input.type) {
      throw new FieldMissing("type");
    }

    if (!input.type) {
      throw new FieldInvalid("type");
    }

    if (!input.roles) {
      throw new FieldMissing("roles");
    }

    return new Partner({
      address: Address.create(input?.address as any),
      createdAt: new Date(),
      email: Email.create(input.email),
      id: crypto.randomUUID().toString(),
      name: input.name,
      phone: Phone.create(input.phone),
      roles: input.roles,
      status: "ACTIVE",
      taxId: TaxId.create(input.taxId),
      type: input.type,
      workspaceId: input.workspaceId,
      contacts: [],
    });
  }
}
