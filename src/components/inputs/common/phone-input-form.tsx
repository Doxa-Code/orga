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
import { InputPhone } from "./input-phone";

export const PhoneInputForm: React.FC<InputFormDefaultProps> = ({
  form,
  ...props
}) => {
  return (
    <FormField
      control={form?.control}
      name={props.name}
      render={({ field }) => (
        <FormItem
          data-hidden={props.hidden}
          className={cn("w-80", props.className)}
        >
          <FormLabel className={cn(props.required && "required")}>
            {props.label}
          </FormLabel>
          <FormControl>
            <InputPhone {...field} />
          </FormControl>
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};
