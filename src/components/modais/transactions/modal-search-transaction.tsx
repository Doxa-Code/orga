"use client";

import {
  QueryKeyFactory,
  useServerActionMutation,
} from "@/app/actions/query-key-factory";
import { searchTransaction } from "@/app/actions/transactions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SEARCH_TRANSACTION_MODAL_NAME } from "@/constants";
import { SearchTransactionsOutputDTO } from "@/core/application/usecases/search-transactions";
import { useModais } from "@/hooks/use-modais";
import { useQueryStateTransactions } from "@/hooks/use-query-state-transactions";
import { useTransaction } from "@/hooks/use-transaction";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

export type FilterSearchTransaction = {
  from?: Date;
  to?: Date;
  search?: string;
  selected?: SearchTransactionsOutputDTO[];
};

export function ModalSearchTransaction() {
  const { closeModal, openModal, modaisNames } = useModais();
  const { walletId } = useQueryStateTransactions();
  const { transactionId: transactionFromOFXId, linkTransaction } =
    useTransaction();

  const [transactions, setTransactions] = useState<
    SearchTransactionsOutputDTO[]
  >([]);

  const INITIAL_FILTERS = {
    search: undefined,
    from: undefined,
    to: undefined,
    selected: undefined,
  };

  const [filters, setFilters] =
    useState<FilterSearchTransaction>(INITIAL_FILTERS);

  const mutate = useServerActionMutation(searchTransaction, {
    mutationKey: QueryKeyFactory.searchTransaction(),
    onSuccess(data) {
      setTransactions(data);
    },
  });

  useEffect(() => {
    if (modaisNames.has(SEARCH_TRANSACTION_MODAL_NAME)) {
      mutate.mutateAsync({ ...filters, walletId: walletId || undefined });
    }
  }, [filters, modaisNames.has(SEARCH_TRANSACTION_MODAL_NAME)]);

  const setSaveFilters = (changedFilters: FilterSearchTransaction) =>
    setFilters({
      ...filters,
      ...changedFilters,
    });

  return (
    <Dialog
      open={modaisNames.has(SEARCH_TRANSACTION_MODAL_NAME)}
      onOpenChange={(open) =>
        open
          ? openModal(SEARCH_TRANSACTION_MODAL_NAME)
          : closeModal(SEARCH_TRANSACTION_MODAL_NAME)
      }
    >
      <DialogContent className="bg-white sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Buscar Lançamento</DialogTitle>
          <DialogDescription>
            Selecione o lançamento que mais faz sentido com a transação do seu
            extrato.
          </DialogDescription>
        </DialogHeader>
        {/* <SearchTrasactionsHeaderTable
          setFilters={setSaveFilters}
          filters={filters}
        /> */}
        <ScrollArea className="h-[500px]">
          {/* <TableSearchTransactions
            transactions={transactions}
            filters={filters}
            setFilters={setSaveFilters}
          /> */}
        </ScrollArea>
        <DialogFooter className="flex !flex-col">
          <div className="flex w-full justify-end">
            <Button
              onClick={() => {
                linkTransaction({
                  amount: filters?.selected?.[0]?.amount!,
                  category: filters?.selected?.[0]?.category!,
                  description: filters?.selected?.[0]?.description!,
                  dueDate: filters?.selected?.[0]?.dueDate!,
                  id: filters?.selected?.[0]?.id!,
                  partnerName: filters?.selected?.[0]?.partnerName!,
                  type: filters?.selected?.[0]?.type!,
                  transactionFromOFXId: transactionFromOFXId!,
                  transactionId: filters?.selected?.[0]?.transactionId!,
                });

                closeModal(SEARCH_TRANSACTION_MODAL_NAME);
              }}
              type="submit"
              variant="secondary"
            >
              Conciliar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
