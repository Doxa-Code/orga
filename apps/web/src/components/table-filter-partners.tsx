"use client";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import type { Table } from "@tanstack/react-table";
import { ChevronDown, Container, UserRound } from "lucide-react";
import type React from "react";
import { useId } from "react";
import { InputSearch } from "./inputs/common/input-search";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { PopoverContent } from "./ui/popover";

type Props = {
  table: Table<any>;
};

export const TableFilterPartners: React.FC<Props> = ({ table, ...props }) => {
  const id = useId();

  const handleFilter = (checked: boolean, key: string, value: string) => {
    const filterValue = table.getColumn(key)?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }
    table
      .getColumn(key)
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Filter by name or email */}
      <InputSearch
        onSearch={(value) => {
          table.getColumn("name")?.setFilterValue(value);
        }}
      />
      {/* Filter by status */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <span className="text-[#2A62B2] font-semibold text-sm">
              Mais filtros
            </span>
            <ChevronDown
              className="opacity-60 stroke-[#2A62B2]"
              size={16}
              strokeWidth={3}
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-44 z-50 p-3" align="start">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Filtros
            </div>
            <div className="space-y-3">
              {[
                { label: "Ativo", value: "ACTIVE", key: "status" },
                { label: "Inativo", value: "INACTIVE", key: "status" },
                {
                  label: (
                    <div className="flex gap-2 items-center">
                      <UserRound size={14} />
                      <span>Clientes</span>
                    </div>
                  ),
                  value: "CUSTOMER",
                  key: "roles",
                },
                {
                  label: (
                    <div className="flex gap-2 items-center">
                      <Container size={14} />
                      <span>Fornecedores</span>
                    </div>
                  ),
                  value: "SUPPLIER",
                  key: "roles",
                },
              ].map(({ value, label, key }, i) => {
                return (
                  <div key={value} className="flex items-center gap-2">
                    <Checkbox
                      id={`${id}-${i}`}
                      onCheckedChange={(checked: boolean) =>
                        handleFilter(checked, key, value)
                      }
                    />
                    <Label
                      htmlFor={`${id}-${i}`}
                      className="flex grow font-light justify-between gap-2"
                    >
                      {label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
