import type { Address } from "../../domain/valueobjects/address";
import { City } from "../../domain/valueobjects/city";
import { State } from "../../domain/valueobjects/state";
import { AddressMapper, type AddressRaw } from "../mappers/address-mapper";
import type { CityRaw } from "../mappers/city-mapper";
import type { StateRaw } from "../mappers/state-mapper";

interface RetrieveAddressEntitiesDriver {
  listState(): Promise<StateRaw[]>;
  retrieveCities(acronymState: string): Promise<CityRaw[]>;
  retrieveAddressByZipCode(zipcode: string): Promise<AddressRaw | null>;
}

export class ListAddressEntitiesDAO {
  constructor(
    private readonly retrieveAddressEntitiesDriver: RetrieveAddressEntitiesDriver,
  ) {}

  async listStates(): Promise<State[]> {
    const response = await this.retrieveAddressEntitiesDriver.listState();
    return (
      response?.map((state) => State.create(state.acronym, state.name)) || []
    ).sort((stateA, stateB) => (stateA.name > stateB.name ? 1 : -1));
  }

  async retrieveCities(acronymState: string): Promise<City[]> {
    const response =
      await this.retrieveAddressEntitiesDriver.retrieveCities(acronymState);
    return response?.map((city) => City.create(city.name)) || [];
  }

  async retrieveAddressByZipCode(zipcode: string): Promise<Address | null> {
    const response =
      await this.retrieveAddressEntitiesDriver.retrieveAddressByZipCode(
        zipcode,
      );
    if (!response) {
      return null;
    }
    return AddressMapper.toDomain(response);
  }
}
