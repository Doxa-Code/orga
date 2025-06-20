import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import { Checkbox } from "@/components/ui/checkbox";

export const CheckboxInputForm: React.FC<InputFormDefaultProps> = (props) => {
  return (
    <FormField {...props}>
      {(field) => (
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      )}
    </FormField>
  );
};
