export class FieldAlreadyExists extends Error {
  constructor(field: string) {
    super(`${field} já existe`);
    this.name = "FieldAlreadyExists";
  }
}
