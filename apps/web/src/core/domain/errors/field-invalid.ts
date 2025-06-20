export class FieldInvalid extends Error {
  constructor(field: string) {
    super(`${field} está inválido!`);
    this.name = "FieldInvalid";
  }
}
