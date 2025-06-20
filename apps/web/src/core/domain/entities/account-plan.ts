import { AccountPlanCategory } from "../valueobjects/account-plan-category";

export namespace AccountPlan {
  export type Operation = "REVENUE" | "EXPENSE";

  export type Type =
    | "OPERATIONAL_REVENUE"
    | "NON_OPERATIONAL_REVENUE"
    | "OTHER_REVENUE"
    | "FINANCIAL_REVENUE"
    | "PARTNERSHIP_REVENUE"
    | "MISCELLANEOUS_REVENUE"
    | "FIXED_EXPENSE"
    | "VARIABLE_EXPENSE"
    | "COST"
    | "DEBT";

  export interface Props {
    id: string;
    name: string;
    sequence: number;
    type: Type;
    operation: Operation;
    categories: AccountPlanCategory[];
    workspaceId: string;
  }
}

export type CreateAccountPlanDTO = {
  name: string;
  sequence: number;
  type: AccountPlan.Type;
  operation: AccountPlan.Operation;
  categories?: {
    sequence: string;
    name: string;
  }[];
  workspaceId: string;
};

export class AccountPlan {
  public id: string;
  public sequence: number;
  public name: string;
  public operation: AccountPlan.Operation;
  public type: AccountPlan.Type;
  public categories: AccountPlanCategory[];
  public workspaceId: string;

  constructor(props: AccountPlan.Props) {
    this.name = props.name;
    this.type = props.type;
    this.categories = props.categories;
    this.workspaceId = props.workspaceId;
    this.sequence = props.sequence;
    this.operation = props.operation;
  }

  static instance(props: AccountPlan.Props) {
    return new AccountPlan(props);
  }

  static create(input: CreateAccountPlanDTO) {
    return new AccountPlan({
      id: crypto.randomUUID().toString(),
      categories: (input?.categories || []).map((category) =>
        AccountPlanCategory.create(category.sequence, category.name),
      ),
      name: input.name,
      operation: input.operation,
      sequence: input.sequence,
      type: input.type,
      workspaceId: input.workspaceId,
    });
  }

  addCategory(name: string) {
    if (this.categories.length <= 0) {
      this.categories.push(
        AccountPlanCategory.create(`${this.sequence}.1`, name),
      );
      return;
    }

    const lastCategory = this.categories.at(-1);

    this.categories.push(
      AccountPlanCategory.create(lastCategory!.getNextSequence(), name),
    );
  }
}
