import { Address } from "../valueobjects/address";
import { Email } from "../valueobjects/email";
import { Phone } from "../valueobjects/phone";
import { TaxId } from "../valueobjects/taxid";

export namespace Workspace {
  export interface Props {
    id: string;
    name: string;
    cnpj: TaxId;
    address: Address;
    phone: Phone;
    email: Email;
  }
}

export class Workspace {
  public id: string;
  public name: string;
  public cnpj: TaxId;
  public address: Address;
  public phone: Phone;
  public email: Email;

  constructor(props: Workspace.Props) {
    this.id = props.id;
    this.name = props.name;
    this.cnpj = props.cnpj;
    this.address = props.address;
    this.phone = props.phone;
    this.email = props.email;
  }

  static instance(props: Workspace.Props) {
    return new Workspace(props);
  }

  static create(name: string) {
    return new Workspace({
      id: crypto.randomUUID().toString(),
      name: name || "",
      address: Address.create(),
      cnpj: TaxId.create(""),
      email: Email.create(""),
      phone: Phone.create(""),
    });
  }
}
