import { State } from "../../domain/valueobjects/state";

export type StateRaw = { acronym: string; name: string };

export class StateMapper {
  static toRaw(state: State): StateRaw {
    return {
      acronym: state.acronym,
      name: state.name,
    };
  }

  static toDomain(state: StateRaw) {
    return State.create(state.acronym, state.name);
  }
}
