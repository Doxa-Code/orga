import { searchTransaction } from "@/app/actions/transactions";
import { listWalletsLikeOption } from "@/app/actions/wallets";
import { ResumeTransactionCardList } from "@/components/cards/transactions/resume-transaction-card-list";
import { MainPage } from "@/components/common/main-page";
import { HeaderFilterTransactions } from "@/components/headers/transactions/header-filter-transactions";
import { TransactionsHeaderPage } from "@/components/headers/transactions/transactions-header-page";
import { SessionPage } from "@/components/sessions/common/session-page";
import { TableSkeletonTransaction } from "@/components/skeletons/transactions/table-skeleton-transaction";
import { TableTransactions } from "@/components/tables/transactions/table-transactions";
import { TransactionsTableActions } from "@/components/tables/transactions/transactions-table-actions";
import { searchParamsTransactions } from "@/hooks/use-query-state-transactions";
import { GetResumeFromTransactionsPresentation } from "@orga/core/presenters";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Transações | Budget Saas",
};

export default async function Transactions({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = searchParamsTransactions.parse(searchParams);

  async function loadMoreTransactions(period: {
    from: Date | null;
    to: Date | null;
  }) {
    const [data] = await searchTransaction({
      from: period.from || undefined,
      to: period.to || undefined,
    });

    const filteredBySearch = (data || [])
      .filter((transaction) =>
        !params.search
          ? true
          : transaction.partnerName
              .toLowerCase()
              .includes(params.search?.toLowerCase()!) ||
            transaction.description
              .toLowerCase()
              .includes(params.search?.toLowerCase()!),
      )
      .filter((transaction) =>
        !params.walletId ? true : transaction.walletId === params.walletId,
      );

    const resume =
      GetResumeFromTransactionsPresentation.create(filteredBySearch);

    const transactions = filteredBySearch.filter((transaction) =>
      params.filterTypeTransaction !== "TOTAL"
        ? transaction.type === params.filterTypeTransaction
        : true,
    );

    return { resume, transactions };
  }

  const [[wallets], { resume, transactions }] = await Promise.all([
    listWalletsLikeOption(),
    loadMoreTransactions({
      from: params.from,
      to: params.to,
    }),
  ]);

  return (
    <MainPage>
      <TransactionsHeaderPage />
      <SessionPage>
        <HeaderFilterTransactions wallets={wallets || []} />
        <ResumeTransactionCardList resume={resume} />
        <TransactionsTableActions transactions={transactions} />
        <TableTransactions transactions={transactions} />
      </SessionPage>
    </MainPage>
  );
}
