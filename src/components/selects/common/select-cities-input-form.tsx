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
import { SelectCities } from "./select-cities";

export const SelectCitiesInputForm: React.FC<
  InputFormDefaultProps & {
    acronym?: string;
  }
> = ({ form, acronym, ...props }) => {
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
            <SelectCities {...field} acronym={acronym} />
          </FormControl>
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};
