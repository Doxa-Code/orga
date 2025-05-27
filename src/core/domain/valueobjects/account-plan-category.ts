type Props = {
  sequence: string;
  name: string;
  amount: number;
};

export class AccountPlanCategory {
  constructor(
    readonly sequence: string,
    readonly name: string,
    readonly amount: number,
  ) {}

  getNextSequence() {
    const [accountPlanSequence, lastCategorySequence] = this.sequence
      .split(".")
      .map((id) =>
        !isFinite(Number(id)) || isNaN(Number(id)) ? 1 : Number(id),
      );

    return `${accountPlanSequence}.${(lastCategorySequence || 0) + 1}`;
  }

  static instance(props: Props) {
    return new AccountPlanCategory(props.sequence, props.name, props.amount);
  }

  static create(sequence: string, name: string) {
    return new AccountPlanCategory(sequence, name, 0);
  }
}
