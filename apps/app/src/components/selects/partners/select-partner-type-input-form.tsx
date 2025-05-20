import { cn } from "@orga";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@orga/ui/form";
import type { InputFormDefaultProps } from "../../type";
import { SelectPartnerType } from "./select-partner-type";

export const SelectPartnerTypeInputForm: React.FC<InputFormDefaultProps> = ({
  form,
  ...props
}) => {
  return (
    <FormField
      control={form?.control}
      name={props.name}
      render={({ field }) => (
        <FormItem data-hidden={props.hidden} className={props.className}>
          <FormLabel className={cn(props.required && "required")}>
            {props.label}
          </FormLabel>
          <FormControl>
            <SelectPartnerType {...field} />
          </FormControl>
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};
