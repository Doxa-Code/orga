"use client";

import type { partnerSchema } from "@/app/(private)/partners/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type ColumnDef,
  type FilterFn,
  type PaginationState,
  type Row,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";
import { Filters } from "./filters";
import { ModalDelete } from "./modais/common/modal-delete";
import { FooterPagination } from "./pagination";

type Item = z.infer<typeof partnerSchema>;

const multiColumnFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const arrayFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
  return row.original.roles.some((r) => filterValue.includes(r));
};

const columns: ColumnDef<Item>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Nome",
    accessorKey: "name",
    size: 400,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Documento",
    accessorKey: "taxId",
    size: 220,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Telefone",
    accessorKey: "phone",
    size: 180,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("status") === "INACTIVE" &&
            "bg-muted-foreground/60 text-primary-foreground",
        )}
      >
        {row.getValue("status") === "ACTIVE" ? "Ativo" : "Inativo"}
      </Badge>
    ),
    size: 100,
  },
  {
    header: "Tipo",
    accessorKey: "roles",
    cell: ({ row }) =>
      row.original?.roles?.map((role) => (
        <Badge key={role}>
          {role === "CUSTOMER" ? "Cliente" : "Fornecedor"}
        </Badge>
      )),
    size: 100,
    filterFn: arrayFilterFn,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 100,
    enableHiding: false,
  },
];

type Props = {
  partners: Item[];
};

export default function TablePartners(props: Props) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: props.partners ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="space-y-4 bg-white p-4 rounded shadow">
      <Filters table={table} />
      {/* Table */}
      <div className="overflow-hidden border-y border-border">
        <header
          data-hidden={!table.getSelectedRowModel().rows.length}
          className="bg-[#F1F4F9] flex items-center gap-2 py-1.5 border-b"
        >
          <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center bg-background px-1 font-[inherit] text-[0.625rem] font-light">
            {table.getSelectedRowModel().rows.length} registro(s) selecionado(s)
          </span>
          <ModalDelete onContinue={async () => {}} />
        </header>
        <Table className="table-fixed">
          <TableHeader className="bg-[#F1F4F9]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-9 text-sm text-[#323232]"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer select-none items-center justify-between gap-2",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <ChevronUp
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDown
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-sm font-light"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0 truncate">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FooterPagination table={table} />
    </div>
  );
}

function RowActions({ row }: { row: Row<Item> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            className="!py-0 !px-2 h-7 rounded"
          >
            <span className="text-[#2A62B2] font-semibold text-sm">Ações</span>
            <ChevronDown
              className="opacity-60 stroke-[#2A62B2]"
              size={16}
              strokeWidth={3}
              aria-hidden="true"
            />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="px-4">
          <span className="font-light">Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4">
          <span className="font-light">Inativar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
