import { LabelTaxId } from "@/components/labels/partners/label-tax-id";
import type { InputFormDefaultProps } from "@/components/type";
import { cn } from "@orga";
import type { PartnerRetrievedOutputDTO } from "@orga/core/application";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@orgarm";
import { InputLoadByTaxId } from "./input-load-by-tax-id";

type Props = {
  onRetrievedPartnerByTaxId(partner?: PartnerRetrievedOutputDTO | null): void;
} & InputFormDefaultProps;

export const TaxIdLoaderInputForm: React.FC<Props> = ({ form, ...props }) => {
  return (
    <FormField
      control={form?.control}
      name={props.name}
      render={({ field }) => (
        <FormItem
          data-hidden={props.hidden}
          className={cn("min-w-80", props.className)}
        >
          <LabelTaxId required={props.required} type={form?.getValues().type} />
          <FormControl>
            <InputLoadByTaxId
              {...field}
              onRetrievedPartnerByTaxId={props.onRetrievedPartnerByTaxId}
              type={form?.getValues().type}
            />
          </FormControl>
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};
