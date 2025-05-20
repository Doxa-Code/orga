import {
  listWalletsLikeOption,
  retrieveWalletTransactionsHistory,
} from "@/app/actions/wallets";
import { MainPage } from "@/components/common/main-page";
import { TrasactionsHistoryHeaderTable } from "@/components/headers/transactions/transactions-history-header-table";
import { ReconcileWalletTabContent } from "@/components/tabs/reconcile-wallet-tab-content";
import { TabListSession } from "@/components/tabs/tab-list-sessions";
import { TransactionHistoryWalletTabContent } from "@/components/tabs/transaction-history-wallet-tab-content";
import { Tabs } from "@orga/ui/tabs";
import { startOfMonth } from "date-fns";
import type { Metadata } from "next";

export const meta: Metadata = {
  title: "Movimentações | Budget Saas",
};

export default async function WalletTransactionHistory({
  searchParams,
}: {
  searchParams: { from: string; to: string; walletId: string };
}) {
  const [wallet] = await retrieveWalletTransactionsHistory({
    walletId: searchParams.walletId,
    from: searchParams.from
      ? new Date(searchParams.from)
      : startOfMonth(new Date()),
    to: searchParams.to ? new Date(searchParams.to) : startOfMonth(new Date()),
  });

  const [wallets] = await listWalletsLikeOption();

  return (
    <MainPage>
      <TrasactionsHistoryHeaderTable
        walletBalance={wallet?.balance || 0}
        wallets={wallets || []}
      />
      <Tabs
        defaultValue="Movimentações"
        className="w-full flex-1 bg-white p-4 rounded border flex flex-col overflow-hidden"
      >
        <TabListSession tabsName={["Movimentações", "Conciliação bancária"]} />
        <TransactionHistoryWalletTabContent wallet={wallet} />
        <ReconcileWalletTabContent
          walletId={searchParams.walletId}
          bankName={wallet?.surname!}
        />
      </Tabs>
    </MainPage>
  );
}
