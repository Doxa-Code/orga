export class State {
  constructor(
    readonly acronym: string,
    readonly name: string,
  ) {}

  static create(acronym: string, name: string) {
    return new State(acronym || "", name || "");
  }
}
