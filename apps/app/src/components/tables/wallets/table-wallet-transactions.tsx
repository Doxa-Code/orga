"use client";

import { Paragraph } from "@/components/common/typograph";
import { DataTable } from "@/components/tables/common/table";
import type { TransactionsHistoryOutpuDTO } from "@orga/core/presenters";

type Props = {
  transactions?: TransactionsHistoryOutpuDTO[];
};

export const TableWalletTransactions: React.FC<Props> = ({ transactions }) => {
  return (
    <DataTable
      columns={[
        {
          accessorKey: "date",
          enableSorting: true,
          header: "Data",
          className: "!w-[10px]",
          cell: (props) =>
            new Date(props.getValue<string>()).toLocaleDateString(),
        },
        {
          enableSorting: true,
          accessorKey: "description",
          header: "Descrição",
        },
        {
          accessorKey: "amount",
          header: "Valor (R$)",
          align: "right",
          className: "!w-[150px]",
          cell: (props) => (
            <Paragraph
              data-positive={props.getValue<number>() > 0}
              data-negative={props.getValue<number>() < 0}
              className="font-normal"
            >
              {props
                .getValue<number>()
                .toLocaleString("pt-br", {
                  currency: "BRL",
                  style: "currency",
                })
                .replace("R$", "")}
            </Paragraph>
          ),
        },
      ]}
      data={transactions}
    />
  );
};
