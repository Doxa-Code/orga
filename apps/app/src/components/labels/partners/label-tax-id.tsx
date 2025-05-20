import { cn } from "@orga";
import { PartnerType } from "@orga/core/domain";
import { FormLabel } from "@orgarm";

type Props = {
  type?: PartnerType;
  required?: boolean;
};

export const LabelTaxId: React.FC<Props> = (props) => {
  return (
    <FormLabel className={cn(props.required && "required")}>
      {props?.type === PartnerType.COMPANY ? "CNPJ" : "CPF"}
    </FormLabel>
  );
};
