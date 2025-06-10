import { listFinanceEntities } from "@/app/actions/finance-entities";
import { useServerActionQuery } from "@/app/actions/query-key-factory";
import type { InputDefaultProps } from "@/components/type";
import { Select } from "./select";
import { Transaction } from "@/core/domain/entities/transaction";

type Props = {
  transactionType: Transaction.Type;
} & InputDefaultProps;

export const SelectAccountPlanCategories: React.FC<Props> = (props) => {
  const listFinanceEntitiesAction = useServerActionQuery(listFinanceEntities, {
    input: undefined,
    queryKey: ["listFinanceEntities"],
  });

  return (
    <Select
      options={(listFinanceEntitiesAction.data?.categories || [])
        .filter((category) => props.transactionType === category.type)
        .map((category) => category.name)}
      className="w-full"
      selected={props.value as any}
      onSelect={props.onChange}
      noAddButton
    />
  );
};
