import type { InputFormDefaultProps } from "@/components/type";
import { cn } from "@orga";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@orga/ui/form";
import { SelectCities } from "./select-cities";

export const SelectCitiesInputForm: React.FC<InputFormDefaultProps> = ({
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
            Cidade
          </FormLabel>
          <FormControl>
            <SelectCities
              {...field}
              acronym={form?.getValues()?.address?.state}
            />
          </FormControl>
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};
