"use client";
import { Paragraph } from "@/components/common/typograph";
import { cn } from "@orga";
import { Button } from "@orga/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@orgable";
import { Checkbox } from "@orgaeckbox";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";

interface DataTableProps<TData, TValue> {
  columns: (ColumnDef<TData, TValue> & {
    align?: "center" | "right";
    className?: string;
  })[];
  data?: TData[];
  withCheckbox?: boolean;
  onSelectedRows?: (data: TData[]) => void;
  withoutHeaders?: boolean;
  onClickRow?: (row: TData) => void;
  singleSelect?: boolean;
}

export type TableHandles = {
  clearSelection(): void;
};

export const DataTable = forwardRef<TableHandles, DataTableProps<any, any>>(
  <TData, TValue>(
    { columns, data, ...props }: DataTableProps<TData, TValue>,
    ref: React.Ref<unknown> | undefined,
  ) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
      React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    if (props.withCheckbox) {
      columns = [
        {
          id: "select",
          align: "center",
          className: "w-[80px]",
          header: ({ table }) =>
            props.singleSelect ? null : (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
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
          enableSorting: false,
          enableHiding: false,
        },
        ...columns,
      ];
    }

    const table = useReactTable({
      data: data || [],
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      enableRowSelection: !!props.withCheckbox,
      enableMultiRowSelection: !props.singleSelect,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination: { pageIndex: 0, pageSize: data?.length || 0 },
      },
    });

    useEffect(() => {
      if (props.onSelectedRows) {
        props.onSelectedRows(
          table.getSelectedRowModel().rows.map((row) => row.original),
        );
      }
    }, [table.getSelectedRowModel().rows.length]);

    useImperativeHandle(ref, () => {
      return {
        clearSelection: table.resetRowSelection,
      };
    });

    return (
      <Table>
        <TableHeader
          className="sticky top-0"
          data-hidden={props.withoutHeaders}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="bg-background" key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => {
                const content = flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                );
                return (
                  <TableHead
                    className={cn(
                      "border-[#F5F4F8] whitespace-nowrap pr-6",
                      columns[i]?.className,
                    )}
                    key={header.id}
                  >
                    <div
                      onClick={() =>
                        columns[i]?.enableSorting
                          ? header.column.toggleSorting(
                              header.column.getIsSorted() === "asc",
                            )
                          : undefined
                      }
                      data-align={columns[i]?.align}
                      className="flex cursor-pointer items-center justify-start px-2 data-[align=right]:justify-end data-[align=center]:justify-center"
                    >
                      {typeof content === "string" ? (
                        <Paragraph className="text-sm font-medium text-slate-700">
                          {content}
                        </Paragraph>
                      ) : (
                        content
                      )}
                      {columns[i]?.enableSorting && (
                        <Button
                          variant="ghost"
                          className="ml-2 rounded-md px-1"
                        >
                          <CaretSortIcon className="" />
                        </Button>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length <= 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="border-b bg-white px-6 py-4 pr-6 font-light text-gray-600"
              >
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          )}
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="bg-white hover:bg-amber-50 [&:nth-child(even)]:bg-opacity-50"
              onClick={() => {
                row.toggleSelected(!row.getIsSelected());
                props.onClickRow?.(row.original);
              }}
            >
              {row.getVisibleCells().map((cell, i) => {
                return (
                  <TableCell className="border-b py-4 pr-6" key={cell.id}>
                    <div
                      data-align={columns[i]?.align}
                      className="flex cursor-pointer items-center justify-start whitespace-nowrap px-2 font-light text-slate-900 data-[align=right]:justify-end data-[align=center]:justify-center"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
);
