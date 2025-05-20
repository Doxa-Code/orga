export class City {
  constructor(readonly name: string) {}

  static create(value: string) {
    let name = value || "";

    name = name
      .split(" ")
      .map((word) =>
        word.length < 3
          ? word.toLowerCase()
          : word[0]?.toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(" ");

    return new City(name);
  }
}
