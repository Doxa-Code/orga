import type { InputDefaultProps } from "@/components/type";
import { PAYMENT_CONDITION } from "@/constants";
import { Select } from "./select";

type Props = InputDefaultProps;

export const SelectPaymentCondition: React.FC<Props> = (props) => {
  return (
    <Select
      className="w-32"
      options={PAYMENT_CONDITION}
      selected={props.value as any}
      onSelect={(value) => props.onChange(Number(value))}
      noAddButton
      noSearchInput
      noClearButton
    />
  );
};
