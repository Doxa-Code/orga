import { Address } from "../../domain/valueobjects/address";
import { City } from "../../domain/valueobjects/city";
import { State } from "../../domain/valueobjects/state";

interface RetrieveAddressEntitiesDriver {
  listState(): Promise<State[]>;
  retrieveCities(acronymState: string): Promise<City[]>;
  retrieveAddressByZipCode(zipcode: string): Promise<Address | null>;
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
    return Address.create(response);
  }
}
