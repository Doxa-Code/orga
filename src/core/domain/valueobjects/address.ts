import { FieldInvalid } from "../errors/field-invalid";
type AddressProps = {
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  note: string | null;
};

type AddressRaw = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  note: string;
};

export class Address {
  private constructor(
    readonly street: string,
    readonly number: string,
    readonly neighborhood: string,
    readonly city: string,
    readonly state: string,
    readonly zipCode: string,
    readonly country: string,
    readonly note: string
  ) {
    if (
      !this.isValidAddress(
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
        country
      )
    ) {
      throw new FieldInvalid("Address");
    }
  }

  public static create(props?: AddressProps | null): Address {
    return new Address(
      props?.street || "",
      props?.number || "",
      props?.neighborhood || "",
      props?.city || "",
      props?.state || "",
      props?.zipCode || "",
      props?.country || "",
      props?.note || ""
    );
  }

  private isValidAddress(
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ): boolean {
    return (
      street.length >= 0 &&
      number.length >= 0 &&
      neighborhood.length >= 0 &&
      (city.length > 2 || city.length === 0) &&
      (state.length > 1 || state.length === 0) &&
      zipCode.length >= 0 &&
      (country.length > 1 || country.length === 0)
    );
  }

  raw(): AddressRaw {
    return {
      street: this.street,
      number: this.number,
      neighborhood: this.neighborhood,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      note: this.note,
    };
  }

  public getFullAddress(): string {
    return `${this.street}, ${this.number}, ${this.neighborhood}, ${this.city}, ${this.state}, ${this.zipCode}, ${this.country}`;
  }
}
