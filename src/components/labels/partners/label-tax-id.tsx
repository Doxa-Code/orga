import { FormLabel } from "@/components/ui/form";
import type { Partner } from "@/core/domain/entities/partner";
import { cn } from "@/lib/utils";

type Props = {
  type?: Partner.Type;
  required?: boolean;
};

export const LabelTaxId: React.FC<Props> = (props) => {
  return (
    <FormLabel className={cn(props.required && "required")}>
      {props?.type === "COMPANY" ? "CNPJ" : "CPF"}
    </FormLabel>
  );
};
