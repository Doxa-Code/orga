import { City } from "../../domain/valueobjects/city";

export type CityRaw = { name: string };

export class CityMapper {
  static toRaw(city: City): CityRaw {
    return {
      name: city.name,
    };
  }

  static toDomain(city: CityRaw) {
    return City.create(city.name);
  }
}
