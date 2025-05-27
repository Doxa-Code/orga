import { listStates } from "@/app/actions/address";
import {
  QueryKeyFactory,
  useServerActionQuery,
} from "@/app/actions/query-key-factory";
import type { InputDefaultProps } from "@/components/type";
import { Select } from "../common/select";

type Props = InputDefaultProps;

export const SelectStates: React.FC<Props> = (props) => {
  const listStatesAction = useServerActionQuery(listStates, {
    queryKey: QueryKeyFactory.listStates(),
    input: undefined,
    initialData: [],
  });

  return (
    <Select
      className="w-60"
      options={listStatesAction.data}
      label="name"
      value="acronym"
      noAddButton
      setSelected={(value) => props.onChange(value)}
      selected={props.value}
    />
  );
};
