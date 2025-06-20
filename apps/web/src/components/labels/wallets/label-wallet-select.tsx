import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

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
