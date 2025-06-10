import type { InputDefaultProps } from "@/components/type";
import { PAYMENT_METHOD } from "@/constants";
import { Select } from "./select";

type Props = InputDefaultProps;

export const SelectPaymentMethod: React.FC<Props> = (props) => {
  return (
    <Select
      className="w-60"
      options={PAYMENT_METHOD}
      selected={props.value as any}
      onSelect={(paymentMethod) => {
        props.onChange(paymentMethod);
      }}
      noAddButton
      noSearchInput
    />
  );
};
