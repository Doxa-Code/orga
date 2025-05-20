import { listFinanceEntities } from "@/app/actions/finance-entities";
import { useServerActionQuery } from "@/app/actions/query-key-factory";
import type { InputDefaultProps } from "@/components/type";
import { Select } from "./select";

type CostCenterOption = {
  code: string;
  id: string;
  name: string;
  workspaceId: string;
};

export const SelectCostCenter: React.FC<InputDefaultProps> = (props) => {
  const listFinanceEntitiesAction = useServerActionQuery(listFinanceEntities, {
    input: undefined,
    queryKey: ["listFinanceEntities"],
  });

  return (
    <Select
      className="w-full"
      label="name"
      value="id"
      options={listFinanceEntitiesAction.data?.costCenters}
      setSelected={props.onChange}
      selected={props.value!}
      noAddButton
    />
  );
};
