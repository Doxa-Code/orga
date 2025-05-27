export class NoSufficientBalance extends Error {
  constructor() {
    super("Essa conta ou carteira não tem saldo suficiente para pagar a conta");
    this.name = "NoSufficientBalance";
  }
}
