import type { InputFormDefaultProps } from "@/components/type";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SelectPartnerType } from "./select-partner-type";

export const SelectPartnerTypeInputForm: React.FC<InputFormDefaultProps> = (
  input
) => {
  const { form, ...props } = input;
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
