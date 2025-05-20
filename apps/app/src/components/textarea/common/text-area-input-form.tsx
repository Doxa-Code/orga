import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import { Textarea } from "@orga/ui/textarea";

export const TextAreaInputForm: React.FC<InputFormDefaultProps> = (props) => {
  return (
    <FormField {...props}>
      {(field) => <Textarea className="resize-none" rows={5} {...field} />}
    </FormField>
  );
};
