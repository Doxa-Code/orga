export class WalletBank {
  constructor(
    readonly code: string,
    readonly name: string,
    readonly thumbnail: string,
  ) {}

  static create(code?: string, name?: string, thumbnail?: string) {
    return new WalletBank(code ?? "", name ?? "", thumbnail ?? "");
  }
}
