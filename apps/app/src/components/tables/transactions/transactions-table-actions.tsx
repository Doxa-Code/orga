"use client";

import { deleteTransaction } from "@/app/actions/transactions";
import {
  PAYMENT_TRANSACTION_MODAL_NAME,
  REGISTER_TRANSACTION_MODAL_NAME,
} from "@/constants";
import { useModais } from "@/hooks/use-modais";
import { useQueryStateTransactions } from "@/hooks/use-query-state-transactions";
import { useTransaction } from "@/hooks/use-transaction";
import type { SearchTransactionsOutputDTO } from "@orga/core/application";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useServerAction } from "zsa-react";
import { ActionsTable } from "../common/actions-table";

type Props = {
  transactions?: SearchTransactionsOutputDTO[] | null;
};

export const TransactionsTableActions: React.FC<Props> = (props) => {
  const { selected, setFilters } = useQueryStateTransactions();
  const { set } = useTransaction();
  const { toggleModalName, openModal } = useModais();
  const router = useRouter();
  const deleteTransactionAction = useServerAction(deleteTransaction);

  const rowsSelected = useMemo(() => {
    return (
      props.transactions?.filter((transaction) =>
        selected?.includes(transaction.transactionId),
      ) || []
    );
  }, [selected]);

  async function onDeleteSelected() {
    for (const row of rowsSelected) {
      await deleteTransactionAction.execute({
        transactionId: row.transactionId,
      });
    }
    router.refresh();
  }

  return (
    <ActionsTable
      hidden={rowsSelected.length <= 0}
      selectedsCount={rowsSelected.length}
      buttons={[
        {
          text: "Excluir transações",
          className:
            "border-red-500 bg-transparent text-red-500 hover:text-red-500",
          withConfirmation: true,
          action() {
            onDeleteSelected();
            setFilters({ selected: [] });
          },
        },
        {
          disabled: rowsSelected.length > 1 || rowsSelected.length <= 0,
          action() {
            set({
              transactionId: rowsSelected[0]?.transactionId,
              paymentId: rowsSelected[0]?.id,
            });
            setFilters({ selected: [] });
            toggleModalName(PAYMENT_TRANSACTION_MODAL_NAME);
          },
          text: "Registrar pagamento",
          className:
            "border-emerald-500 bg-transparent text-emerald-500 hover:text-emerald-500",
        },
        {
          disabled: rowsSelected.length > 1 || rowsSelected.length <= 0,
          className:
            "border-slate-500 bg-transparent text-slate-500 hover:text-slate-500",
          action() {
            const params = {
              transactionId: rowsSelected[0]?.transactionId,
              typeToCreate: rowsSelected[0]?.type,
              onFinishRegister() {
                router.refresh();
              },
            };
            setFilters({ selected: [] });
            openModal(REGISTER_TRANSACTION_MODAL_NAME);
            set(params);
          },
          text: "Editar transação",
        },
      ]}
    />
  );
};
