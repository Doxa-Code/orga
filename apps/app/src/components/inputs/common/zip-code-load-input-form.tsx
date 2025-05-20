import type { InputFormDefaultProps } from "@/components/type";
import { cn } from "@orga";
import type { Address } from "@orga/core/domain";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@orgarm";
import { InputLoadByZipCode } from "./input-load-by-zip-code";

type Props = {
  onRetrievedAddressByZipCode: (address?: Address | null) => void;
} & InputFormDefaultProps;

export const ZipCodeLoaderInputForm: React.FC<Props> = ({ form, ...props }) => {
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
            CEP
          </FormLabel>
          <FormControl>
            <InputLoadByZipCode
              onRetrievedAddressByZipCode={props.onRetrievedAddressByZipCode}
              {...field}
            />
          </FormControl>
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};
