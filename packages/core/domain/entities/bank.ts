export class Bank {
  constructor(
    readonly name: string,
    readonly thumbnail: string,
    readonly color: string,
    readonly code: string,
  ) {}

  static create(
    name: string,
    thumbnail?: string,
    color?: string,
    code?: string,
  ) {
    return new Bank(
      name,
      thumbnail || "",
      color || "",
      code ||
        name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase(),
    );
  }
}
