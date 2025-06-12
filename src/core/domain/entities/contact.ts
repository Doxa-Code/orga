import { Phone } from "../valueobjects/phone";

export namespace Contact {
  export type Props = {
    id: string;
    name: string;
    phone: Phone;
  };

  export type Raw = {
    id: string;
    name: string;
    phone: string;
  };
}

export class Contact {
  public id: string;
  public name: string;
  public phone: Phone;

  constructor(props: Contact.Props) {
    this.id = props.id;
    this.name = props.name;
    this.phone = props.phone;
  }

  public raw(): Contact.Raw {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone.value,
    };
  }

  static instance(props: Contact.Props): Contact {
    return new Contact(props);
  }

  static create(name: string, phone: string): Contact {
    return new Contact({
      id: crypto.randomUUID().toString(),
      name: name ?? "",
      phone: new Phone(phone ?? ""),
    });
  }
}
