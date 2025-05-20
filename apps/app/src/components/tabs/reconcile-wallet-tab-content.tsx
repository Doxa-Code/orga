"use client";

import { CreateTransactionToReconcileCard } from "@/components/cards/transactions/create-transaction-to-reconcile-card";
import { TransactionFromOFXCard } from "@/components/cards/transactions/transaction-from-ofx-card";
import { TransactionToReconcileCard } from "@/components/cards/transactions/transaction-to-reconcile-card";
import { ReconcileWalletDropzone } from "@/components/dropzones/wallets/reconcile-wallet-dropzone";
import { useTransaction } from "@/hooks/use-transaction";
import { Button } from "@orga/ui/button";
import { TabsContent } from "@orgabs";
import { ScrollArea } from "@orgaroll-area";
import { useState } from "react";
import { Paragraph } from "../common/typograph";

type Props = {
  walletId: string;
  bankName: string;
};

export const ReconcileWalletTabContent: React.FC<Props> = (props) => {
  const { transactionsToReconcile, set } = useTransaction();

  const [itemsToShow, setItemsToShow] = useState(10);

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 10);
  };

  return (
    <TabsContent
      value="Conciliação bancária"
      className="p-2 rounded flex-1 flex flex-col space-y-4 overflow-hidden"
    >
      <div className="flex-1 overflow-hidden flex flex-col">
        <ReconcileWalletDropzone
          walletId={props.walletId}
          hidden={transactionsToReconcile.length > 0}
        />

        <div
          data-hidden={!transactionsToReconcile.length}
          className="bg-background flex items-center py-2 px-2 rounded mb-6 justify-between"
        >
          <Paragraph className="text-gray-400">
            {transactionsToReconcile.length} lançamentos para serem conciliados
          </Paragraph>
          <Button
            variant="outline"
            className="border-primary text-primary hover:text-primary/70 hover:bg-transparent"
            onClick={() => set({ transactionsToReconcile: [] })}
          >
            Limpar
          </Button>
        </div>
        <header
          data-hidden={!transactionsToReconcile.length}
          className="w-full pb-4 flex gap-4"
        >
          <div className="w-full flex items-center gap-3">
            <Paragraph className="font-normal text-slate-600 text-lg">
              Lançamentos {props.bankName}
            </Paragraph>
          </div>
          <div className="w-[220px]" />
          <div className="w-full flex items-center gap-3">
            <Paragraph className="font-normal text-slate-600 text-lg">
              Lançamentos Budget Saas
            </Paragraph>
          </div>
        </header>
        <ScrollArea
          data-hidden={!transactionsToReconcile.length}
          className="w-full flex flex-1 mb-5"
        >
          <ul className="flex flex-col gap-4 max-h-[250px]">
            {transactionsToReconcile
              ?.slice(0, itemsToShow)
              ?.map(({ transactionFromOFX, transactionToReconcile }, index) => (
                <li
                  key={transactionFromOFX?.id}
                  className="w-full h-[300px] flex gap-4"
                >
                  <TransactionFromOFXCard
                    transaction={transactionFromOFX}
                    onIgnore={() =>
                      set({
                        transactionsToReconcile: transactionsToReconcile.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                  />
                  <div className="flex items-center">
                    <Button>Conciliar</Button>
                  </div>
                  <TransactionToReconcileCard
                    transaction={transactionToReconcile}
                  />
                  <CreateTransactionToReconcileCard
                    hidden={!!transactionToReconcile}
                    transactionFromOFX={transactionFromOFX}
                  />
                </li>
              ))}
            {itemsToShow < transactionsToReconcile.length && (
              <div className="w-full flex justify-center items-center py-5">
                <Button
                  onClick={handleLoadMore}
                  type="button"
                  variant="secondary"
                >
                  Carregar mais
                </Button>
              </div>
            )}
          </ul>
        </ScrollArea>
      </div>
    </TabsContent>
  );
};
