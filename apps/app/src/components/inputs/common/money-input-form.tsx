import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import { InputMoney } from "./input-money";

export const MoneyInputForm: React.FC<InputFormDefaultProps> = (props) => {
  return (
    <FormField {...props}>
      {(field) => <InputMoney disabled={props.disabled} {...field} />}
    </FormField>
  );
};
