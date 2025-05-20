import { Address } from "../../domain/valueobjects/address";

export type AddressRaw = {
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  note?: string;
};

export class AddressMapper {
  static toRaw(address: Address): AddressRaw {
    return {
      city: address.city,
      country: address.country,
      neighborhood: address.neighborhood,
      note: address.note,
      number: address.number,
      state: address.state,
      street: address.street,
      zipCode: address.zipCode,
    };
  }

  static toDomain(address: AddressRaw): Address {
    return Address.create(
      address.street,
      address.number,
      address.neighborhood,
      address.city,
      address.state,
      address.zipCode,
      address.country,
      address.note,
    );
  }
}
