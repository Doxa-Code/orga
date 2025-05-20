"use client";

import { TransactionStatusBadge } from "@/components/badge/transactions/transaction-status-badge";
import { DataTable } from "@/components/tables/common/table";
import { useQueryStateTransactions } from "@/hooks/use-query-state-transactions";
import { useTableRefToManagerSelection } from "@/hooks/use-table-ref";
import type { SearchTransactionsOutputDTO } from "@orga/core/application";
import type {
  TransactionStatus,
  TransactionType,
} from "@orgadomain";
import { ScrollArea } from "@orgaroll-area";
import Image from "next/image";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  transactions?: SearchTransactionsOutputDTO[];
};

export const TableTransactions: React.FC<Props> = ({ transactions }) => {
  const { selected, setFilters } = useQueryStateTransactions();

  const tableRef = useTableRefToManagerSelection({
    rowsSelected: selected!,
  });

  useHotkeys("Esc", () => setFilters({ selected: [] }), []);

  if (!transactions) {
    return null;
  }

  return (
    <DataTable
      onSelectedRows={(rows) =>
        setFilters({ selected: rows.map((row) => row.transactionId) })
      }
      withCheckbox
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
              <Image
                alt="wallet flag"
                src={props.getValue()}
                width={50}
                height={50}
                className="border rounded-full shadow"
                priority
              />
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
      data={transactions}
    />
  );
};
