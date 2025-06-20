export class EntityNotFound extends Error {
  constructor(entity: string) {
    super(`${entity} not found`);
    this.name = "EntityNotFound";
  }
}
