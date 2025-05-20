"use client";

import { TransactionStatusBadge } from "@/components/badge/transactions/transaction-status-badge";
import type { FilterSearchTransaction } from "@/components/modais/transactions/modal-search-transaction";
import { DataTable } from "@/components/tables/common/table";
import { useTableRefToManagerSelection } from "@/hooks/use-table-ref";
import type { SearchTransactionsOutputDTO } from "@orga/core/application";
import { Avatar, AvatarImage } from "@orgaatar";
import type {
  TransactionStatus,
  TransactionType,
} from "@orgadomain";
import { useMemo } from "react";

type Props = {
  transactions?: SearchTransactionsOutputDTO[];
  filters: FilterSearchTransaction;
  setFilters(filters: FilterSearchTransaction): void;
};

export const TableSearchTransactions: React.FC<Props> = (props) => {
  const tableRef = useTableRefToManagerSelection({
    rowsSelected: props.filters.selected || [],
  });

  const transactionsFiltered = useMemo(() => {
    return props.transactions?.filter((transaction) =>
      props.filters.search
        ? transaction.description
            .toLowerCase()
            .includes(props.filters.search.toLowerCase()) ||
          transaction.partnerName
            .toLowerCase()
            .includes(props.filters.search.toLowerCase())
        : true,
    );
  }, [props.filters.search, props.transactions]);

  return (
    <DataTable
      onSelectedRows={(rows) => props.setFilters({ selected: rows })}
      withCheckbox
      singleSelect
      ref={tableRef}
      columns={[
        {
          enableSorting: true,
          accessorKey: "type",
          align: "center",
          header: "Tipo",
          className: "!w-[10px]",
          cell(props) {
            const type = props.getValue<TransactionType>();
            if (type === "CREDIT") {
              return (
                <div className="flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 shadow" />
                </div>
              );
            }
            return (
              <div className="flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-red-500 shadow" />
              </div>
            );
          },
        },
        {
          accessorKey: "dueDate",
          enableSorting: true,
          header: "Competência",
          className: "!w-[10px]",
          cell: (props) =>
            new Date(props.getValue<string>()).toLocaleDateString(),
        },
        {
          enableSorting: true,
          accessorKey: "description",
          className: "!w-[400px]",
          header: "Descrição",
        },
        {
          enableSorting: true,
          accessorKey: "partnerName",
          header: "Cliente/Fornecedor",
          className: "!w-[300px]",
        },
        {
          enableSorting: true,
          accessorKey: "category",
          header: "Categoria",
          className: "!w-[10px]",
        },
        {
          accessorKey: "amount",
          header: "Total (R$)",
          align: "right",
          className: "!w-[150px]",
          cell: (props) =>
            props
              .getValue<number>()
              .toLocaleString("pt-br", {
                currency: "BRL",
                style: "currency",
              })
              .replace("R$", ""),
        },
        {
          accessorKey: "amountPaided",
          header: "Valor pago (R$)",
          align: "right",
          className: "!w-[150px]",
          cell: (props) =>
            props
              .getValue<number>()
              ?.toLocaleString("pt-br", {
                currency: "BRL",
                style: "currency",
              })
              ?.replace("R$", ""),
        },
        {
          accessorKey: "walletFlag",
          header: "Conta",
          cell(props) {
            return (
              <Avatar className="border overflow-hidden shadow">
                <AvatarImage
                  alt="wallet flag"
                  src={props.getValue()}
                  width={20}
                  height={20}
                />
              </Avatar>
            );
          },
        },
        {
          accessorKey: "status",
          header: "Status",
          align: "center",
          cell: (props) => (
            <TransactionStatusBadge
              status={props.getValue<TransactionStatus>()}
              type={props.row.getValue("type")}
            />
          ),
        },
      ]}
      data={transactionsFiltered || []}
    />
  );
};
