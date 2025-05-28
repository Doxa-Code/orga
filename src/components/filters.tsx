"use client";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import type { Table } from "@tanstack/react-table";
import {
  ChevronDown,
  CircleX,
  Container,
  Search,
  UserRound,
} from "lucide-react";
import type React from "react";
import { useId, useRef } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PopoverContent } from "./ui/popover";

type Props = {
  table: Table<any>;
};

export const Filters: React.FC<Props> = ({ table, ...props }) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className="relative">
        <Input
          id={`${id}-input`}
          ref={inputRef}
          className={cn(
            "peer min-w-60 ps-9",
            Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9",
          )}
          value={(table.getColumn("name")?.getFilterValue() ?? "") as string}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          placeholder="Pesquisar"
          type="text"
          aria-label="Pesquisar"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search
            size={16}
            strokeWidth={3}
            aria-hidden="true"
            className="stroke-[#2A62B2]"
          />
        </div>
        {Boolean(table.getColumn("name")?.getFilterValue()) && (
          <Button
            variant="ghost"
            className="absolute hover:bg-transparent inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Clear filter"
            onClick={() => {
              table.getColumn("name")?.setFilterValue("");
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
          >
            <CircleX size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        )}
      </div>
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
        <PopoverContent className="max-w-44 p-3" align="start">
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
