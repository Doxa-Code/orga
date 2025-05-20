import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import type { TransactionType } from "@orga/core/domain";
import { SelectWallets } from "./select-wallets";

type Props = {
  transactionType?: TransactionType;
} & InputFormDefaultProps;

export const SelectWalletInputForm: React.FC<Props> = (props) => {
  return (
    <FormField
      {...props}
      label={
        props.transactionType === "CREDIT"
          ? "Conta de recebimento"
          : "Conta de pagamento"
      }
    >
      {(field) => <SelectWallets {...field} />}
    </FormField>
  );
};
