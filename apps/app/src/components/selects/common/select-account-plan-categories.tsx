import { listFinanceEntities } from "@/app/actions/finance-entities";
import { useServerActionQuery } from "@/app/actions/query-key-factory";
import type { InputDefaultProps } from "@/components/type";
import type { TransactionType } from "@orga/core/domain";
import { Select } from "./select";

type Props = {
  transactionType: TransactionType;
} & InputDefaultProps;

export const SelectAccountPlanCategories: React.FC<Props> = (props) => {
  const listFinanceEntitiesAction = useServerActionQuery(listFinanceEntities, {
    input: undefined,
    queryKey: ["listFinanceEntities"],
  });

  return (
    <Select
      className="w-full"
      label="name"
      value="sequence"
      selected={props.value!}
      options={(listFinanceEntitiesAction.data?.categories || []).filter(
        (category) => props.transactionType === category.type,
      )}
      setSelected={props.onChange}
      noAddButton
    />
  );
};
