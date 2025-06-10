import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import { SelectWallets } from "./select-wallets";
import { Transaction } from "@/core/domain/entities/transaction";

type Props = {
  transactionType?: Transaction.Type;
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
