import { FormLabel } from "@orga/ui/form";
import { cn } from "@orga/utils";

type Props = {
  type?: "CREDIT" | string;
  required?: boolean;
};

export const LabelWalletSelect: React.FC<Props> = (props) => {
  return (
    <FormLabel className={cn(props.required && "required")}>
      {props?.type === "CREDIT" ? "Conta de recebimento" : "Conta de pagamento"}
    </FormLabel>
  );
};
