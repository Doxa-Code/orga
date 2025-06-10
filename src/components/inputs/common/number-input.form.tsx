import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import { Input } from "@/components/ui/input";

export const NumberInputForm: React.FC<InputFormDefaultProps> = ({
  form,
  ...props
}) => {
  return (
    <FormField {...props}>
      {(field) => (
        <Input
          {...field}
          onChange={(e) => {
            if (isNaN(Number(e.target.value))) {
              return;
            }
            field.onChange(Number(e.target.value));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.preventDefault) {
              e.preventDefault();
            }
          }}
        />
      )}
    </FormField>
  );
};
