"use client";

import { DatePickerWithRange } from "@/components/inputs/common/date-picker-with-range";
import { InputSearch } from "@/components/inputs/common/input-search";
import { SelectWallets } from "@/components/selects/wallets/select-wallets";
import { useQueryStateTransactions } from "@/hooks/use-query-state-transactions";
import type { ListWalletLikeOptionOutputDTO } from "@orga/core/presenters";
import { Label } from "@orgabel";
import { useState } from "react";

type Props = {
  wallets: ListWalletLikeOptionOutputDTO[];
};

export const HeaderFilterTransactions: React.FC<Props> = (props) => {
  const { period, setFilters, filterDateId, walletId } =
    useQueryStateTransactions();
  const [search, setSearch] = useState("");

  return (
    <header className="mb-4 flex gap-4">
      <div className="flex flex-col gap-2">
        <Label>Período</Label>
        <DatePickerWithRange
          initialFilter={filterDateId!}
          onSelectDate={(date, filterId) => {
            setFilters({
              from: date?.from,
              to: date?.to,
              selected: [],
              filterDateId: filterId || filterDateId,
            });
          }}
          date={{
            from: period.from || undefined,
            to: period.to || undefined,
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Pesquisar</Label>
        <InputSearch
          value={search}
          placeholder="Ex.: John Doe"
          onChange={(value) => {
            setSearch(value);
          }}
          onSearch={(value) => setFilters({ search: value, selected: [] })}
        />
      </div>
      <div>
        <Label>Conta</Label>
        <SelectWallets
          wallets={props.wallets}
          onChange={(walletId: string) =>
            setFilters({ walletId, selected: [] })
          }
          value={walletId}
        />
      </div>
    </header>
  );
};
