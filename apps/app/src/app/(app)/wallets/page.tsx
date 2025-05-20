import { listWallets } from "@/app/actions/wallets";
import { MainPage } from "@/components/common/main-page";
import { WalletsHeaderPage } from "@/components/headers/wallets/wallets-header-page";
import { WalletsHeaderTable } from "@/components/headers/wallets/wallets-header-table";
import { SessionPage } from "@/components/sessions/common/session-page";
import { TableWallets } from "@/components/tables/wallets/table-wallets";
import { searchParamsWallets } from "@/hooks/use-query-state-wallets";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contas e Carteiras | Budget Saas",
};

export default async function Wallets({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = searchParamsWallets.parse(searchParams);
  const [data] = await listWallets();

  const wallets = (data || []).filter((wallet) =>
    !params.search
      ? true
      : wallet.surname.toLowerCase().includes(params.search?.toLowerCase()!) ||
        wallet?.bankName
          ?.toLowerCase()
          ?.includes(params.search?.toLowerCase()!),
  );

  return (
    <MainPage>
      <WalletsHeaderPage />
      <SessionPage>
        <WalletsHeaderTable />
        <Suspense fallback={<>CARREGANDO...</>}>
          <TableWallets wallets={wallets} />
        </Suspense>
      </SessionPage>
    </MainPage>
  );
}
