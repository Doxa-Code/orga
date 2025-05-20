"use client";
import { InputSearch } from "@/components/inputs/common/input-search";
import { useQueryStateWallets } from "@/hooks/use-query-state-wallets";
import { Label } from "@orga/ui/label";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const WalletsHeaderTable: React.FC = () => {
  const { setFilters } = useQueryStateWallets();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedCallback(
    (search: string) => setFilters({ search }),
    200,
  );

  return (
    <header className="mb-4 flex gap-4">
      <div className="flex flex-col gap-2">
        <Label>Pesquisar</Label>
        <InputSearch
          value={search}
          placeholder="Ex.: Minha poupança"
          onChange={(value) => {
            setSearch(value);
            debouncedSearch(value);
          }}
        />
      </div>
    </header>
  );
};
