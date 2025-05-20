export class TransactionCategory {
  constructor(
    readonly sequence: string,
    readonly name: string,
  ) {}

  static create(sequence?: string, name?: string) {
    return new TransactionCategory(sequence || "0.0", name || "Outros");
  }
}
