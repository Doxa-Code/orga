"use client";

import { useServerActionQuery } from "@/app/actions/query-key-factory";
import { listWalletsLikeOption } from "@/app/actions/wallets";
import { Paragraph } from "@/components/common/typograph";
import type { InputDefaultProps } from "@/components/type";
import Image from "next/image";
import { Select } from "../common/select";
import { ListWalletLikeOptionOutputDTO } from "@/core/presenters/list-wallets-presentation";

type Props = {
  noClearButton?: boolean;
  wallets?: ListWalletLikeOptionOutputDTO[];
} & InputDefaultProps;

export const SelectWallets: React.FC<Props> = ({ wallets = [], ...props }) => {
  const listWalletsLikeOptionAction = useServerActionQuery(
    listWalletsLikeOption,
    {
      input: undefined,
      queryKey: ["listWalletsLikeOption"],
      initialData: wallets,
      gcTime: 1,
    }
  );

  return (
    <Select
      className="w-60 h-10"
      render={(wallet) => {
        return !wallet?.bank! ? (
          wallet.name
        ) : (
          <div className="flex items-center gap-2">
            <Image
              width={40}
              height={40}
              src={wallet.bank?.thumbnail}
              alt={wallet.name}
              className="h-6 w-6 rounded-md bg-cover bg-center"
              priority
            />
            <div>
              <Paragraph className="text-sm">{wallet.name}</Paragraph>
            </div>
          </div>
        );
      }}
      options={listWalletsLikeOptionAction.data}
      label="name"
      value="id"
      selected={props.value as any}
      onSelect={(walletId) => {
        props.onChange(walletId);
      }}
      noAddButton
      noClearButton={props.noClearButton}
    />
  );
};
