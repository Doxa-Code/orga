"use client";
import { DatePickerWithRange } from "@/components/inputs/common/date-picker-with-range";
import { InputSearch } from "@/components/inputs/common/input-search";
import type { FilterSearchTransaction } from "@/components/modais/transactions/modal-search-transaction";
import { Label } from "@orga/ui/label";

type Props = {
  setFilters(filters: FilterSearchTransaction): void;
  filters: FilterSearchTransaction;
};

export const SearchTrasactionsHeaderTable: React.FC<Props> = (props) => {
  return (
    <>
      <header className="mb-4 flex gap-4">
        <div className="flex flex-col gap-2">
          <Label>Período</Label>
          <DatePickerWithRange
            onSelectDate={(date) => {
              props.setFilters({
                from: date?.from!,
                to: date?.to!,
                selected: [],
              });
            }}
            date={{
              from: props.filters.from || undefined,
              to: props.filters.to || undefined,
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Pesquisar</Label>
          <InputSearch
            value={props.filters.search || ""}
            placeholder="Ex.: John Doe"
            onChange={(value) => {
              props.setFilters({ search: value });
            }}
          />
        </div>
      </header>
    </>
  );
};
