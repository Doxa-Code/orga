import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import { SelectPaymentCondition } from "./select-payment-condition";

export const SelectPaymentConditionInputForm: React.FC<
  InputFormDefaultProps
> = (props) => {
  return (
    <FormField {...props}>
      {(field) => <SelectPaymentCondition {...field} />}
    </FormField>
  );
};
