import { AccountPlan } from "../../domain/entities/account-plan";
import { AccountPlanCategory } from "../../domain/valueobjects/account-plan-category";

export interface AccountPlanRaw {
  id: string;
  name: string;
  sequence: number;
  type: AccountPlan.Type;
  operation: AccountPlan.Operation;
  categories: {
    sequence: string;
    name: string;
    amount: number;
  }[];
  workspaceId: string;
}

export class AccountPlanMapper {
  static toPersist(input: AccountPlan): AccountPlanRaw {
    return {
      id: input.id,
      categories: input.categories.map((category) => ({
        amount: category.amount,
        name: category.name,
        sequence: category.sequence,
      })),
      name: input.name,
      operation: input.operation,
      sequence: input.sequence,
      type: input.type,
      workspaceId: input.workspaceId,
    };
  }

  static toDomain(input: AccountPlanRaw): AccountPlan {
    return new AccountPlan({
      id: input.id,
      categories: input.categories.map(
        (category) =>
          new AccountPlanCategory(
            category.sequence,
            category.name,
            category.amount,
          ),
      ),
      name: input.name,
      type: input.type,
      operation: input.operation,
      sequence: input.sequence,
      workspaceId: input.workspaceId,
    });
  }
}
