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
import { SelectStates } from "./select-states";

export const SelectStatesInputForm: React.FC<InputFormDefaultProps> = ({
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
            Estado
          </FormLabel>
          <FormControl>
            <SelectStates {...field} />
          </FormControl>
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};
