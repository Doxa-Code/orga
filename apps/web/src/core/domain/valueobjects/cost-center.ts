export class CostCenter {
  constructor(
    readonly id: string,
    readonly name: string,
  ) {}

  static create(id?: string, name?: string) {
    return new CostCenter(id ?? "", name ?? "");
  }
}
