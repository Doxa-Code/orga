"use client";

import { ButtonPopover } from "@/components/selects/common/button-popover";
import { REGISTER_TRANSACTION_MODAL_NAME } from "@/constants";
import { useModais } from "@/hooks/use-modais";
import { useTransaction } from "@/hooks/use-transaction";
import { TransactionType } from "@orga/core/domain";
import { useRouter } from "next/navigation";

export function TransactionsHeaderPage() {
  const { toggleModalName } = useModais();
  const { set } = useTransaction();
  const router = useRouter();
  return (
    <div className="w-full flex justify-start items-center">
      <ButtonPopover
        title="Nova conta"
        options={[
          {
            label: "Receita",
            onSelect() {
              set({
                typeToCreate: TransactionType.CREDIT,
                transactionId: null,
                paymentId: null,
                onFinishRegister() {
                  router.refresh();
                },
              });
              toggleModalName(REGISTER_TRANSACTION_MODAL_NAME);
            },
          },
          {
            label: "Despesa",
            onSelect() {
              set({
                typeToCreate: TransactionType.DEBIT,
                transactionId: null,
                paymentId: null,
                onFinishRegister() {
                  router.refresh();
                },
              });
              toggleModalName(REGISTER_TRANSACTION_MODAL_NAME);
            },
          },
        ]}
      />
    </div>
  );
}
