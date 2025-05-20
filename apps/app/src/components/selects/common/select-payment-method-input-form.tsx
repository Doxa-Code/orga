import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import { SelectPaymentMethod } from "./select-payment-method";

export const SelectPaymentMethodInputForm: React.FC<InputFormDefaultProps> = (
  props,
) => {
  return (
    <FormField {...props}>
      {(field) => <SelectPaymentMethod {...field} />}
    </FormField>
  );
};
