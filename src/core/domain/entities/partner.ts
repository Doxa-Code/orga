import { FieldInvalid } from "../errors/field-invalid";
import { FieldMissing } from "../errors/field-missing";
import { Address } from "../valueobjects/address";
import { Email } from "../valueobjects/email";
import { Phone } from "../valueobjects/phone";
import { TaxId } from "../valueobjects/taxid";

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
    });
  }
}
