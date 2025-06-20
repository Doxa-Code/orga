import { LabelTaxId } from "@/components/labels/partners/label-tax-id";
import type { InputFormDefaultProps } from "@/components/type";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { PartnerRetrievedOutputDTO } from "@/core/application/DAO/retrieve-partner-by-tax-id";
import type { Partner } from "@/core/domain/entities/partner";
import { cn } from "@/lib/utils";
import { InputLoadByTaxId } from "./input-load-by-tax-id";

type Props = {
  onRetrievedPartnerByTaxId(partner?: PartnerRetrievedOutputDTO | null): void;
  type: Partner.Type;
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
          <LabelTaxId required={props.required} type={props.type} />
          <FormControl>
            <InputLoadByTaxId
              {...field}
              onRetrievedPartnerByTaxId={props.onRetrievedPartnerByTaxId}
              type={props.type}
            />
          </FormControl>
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};
