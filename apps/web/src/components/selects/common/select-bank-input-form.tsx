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
import { SelectBank } from "./select-bank";

type Props = InputFormDefaultProps;

export const SelectBankInputForm: React.FC<Props> = ({ form, ...props }) => {
  return (
    <FormField
      control={form?.control}
      name={props.name}
      render={({ field }) => (
        <FormItem data-hidden={props.hidden}>
          <FormLabel className={cn(props.required && "required")}>
            {props.label}
          </FormLabel>
          <FormControl>
            <SelectBank {...field} />
          </FormControl>
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};
