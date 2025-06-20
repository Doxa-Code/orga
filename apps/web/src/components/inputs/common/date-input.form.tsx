import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import { InputDatePicker } from "./input-date-picker";

export const DateInputForm: React.FC<InputFormDefaultProps> = (props) => {
  return (
    <FormField {...props}>
      {(field) => (
        <InputDatePicker date={field.value} onSelectDate={field.onChange} />
      )}
    </FormField>
  );
};
