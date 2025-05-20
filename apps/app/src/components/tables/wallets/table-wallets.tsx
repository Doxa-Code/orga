"use client";

import { DataTable } from "@/components/tables/common/table";
import type { ListWalletsPresentationOutputDTO } from "@orga/core/presenters";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  wallets?: ListWalletsPresentationOutputDTO[];
};

export const TableWallets: React.FC<Props> = ({ wallets }) => {
  const router = useRouter();
  return (
    <DataTable
      onClickRow={(wallet) => {
        router.push(`/wallets/details?walletId=${wallet.id}`);
      }}
      columns={[
        {
          accessorKey: "flag",
          header: "",
          className: "w-[100px]",
          cell(props) {
            return (
              <Image
                src={props.getValue()}
                alt="wallet flag"
                width={40}
                height={40}
                className="rounded-md shadow"
                loading="eager"
                priority
              />
            );
          },
        },
        {
          enableSorting: true,
          accessorKey: "surname",
          header: "Apelido da conta",
        },
        {
          accessorKey: "bankName",
          enableSorting: true,
          header: "Banco",
        },
        {
          enableSorting: true,
          accessorKey: "type",
          header: "Tipo de conta",
        },
        {
          enableSorting: true,
          accessorKey: "balance",
          header: "Saldo atual (R$)",
          className: "!w-[300px]",
          cell: (props) =>
            props
              .getValue<number>()
              .toLocaleString("pt-br", {
                currency: "BRL",
                style: "currency",
              })
              .replace("R$", ""),
        },
      ]}
      data={wallets!}
    />
  );
};
