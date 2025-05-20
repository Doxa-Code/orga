"use client";
import { useServerActionMutation } from "@/app/actions/query-key-factory";
import { deleteWallet } from "@/app/actions/wallets";
import { Paragraph } from "@/components/common/typograph";
import { DatePickerWithRange } from "@/components/inputs/common/date-picker-with-range";
import { ModalConfirm } from "@/components/modais/common/modal-confirm";
import { SelectPopover } from "@/components/selects/common/select-popover";
import { SelectWallets } from "@/components/selects/wallets/select-wallets";
import { REGISTER_WALLET_MODAL_NAME } from "@/constants";
import { useModais } from "@/hooks/use-modais";
import { useQueryStateWallets } from "@/hooks/use-query-state-wallets";
import { useWallet } from "@/hooks/use-wallet";
import type { ListWalletLikeOptionOutputDTO } from "@orga/core/presenters";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  walletBalance: number;
  wallets: ListWalletLikeOptionOutputDTO[];
};

export const TrasactionsHistoryHeaderTable: React.FC<Props> = (props) => {
  const { filterDateId, period, walletId, setFilters } = useQueryStateWallets();
  const { set } = useWallet();
  const { toggleModalName } = useModais();
  const [openConfirmeDelete, setOpenConfirmDelete] = useState(false);
  const router = useRouter();
  const deleteWalletMutation = useServerActionMutation(deleteWallet, {
    mutationKey: ["delete-wallet"],
    onSuccess() {
      router.replace("/wallets");
    },
  });

  return (
    <header className="bg-white px-4 py-6 flex flex-col gap-6 rounded border">
      <section className="flex gap-4 justify-between items-end">
        <div className="w-60">
          <SelectWallets
            value={walletId}
            onChange={(walletId) => {
              setFilters({ walletId: String(walletId) });
            }}
            noClearButton
            wallets={props.wallets}
          />
        </div>
        <div className="flex gap-4">
          <SelectPopover
            placeholder="Ações"
            label="option"
            value="option"
            onSelect={(value) => {
              if (value === "Excluir conta") {
                setOpenConfirmDelete(true);
              }
              if (value === "Editar conta") {
                set({
                  walletId,
                });
                toggleModalName(REGISTER_WALLET_MODAL_NAME);
              }
            }}
            options={[
              {
                option: "Editar conta",
              },
              {
                option: "Excluir conta",
                className: "text-red-500",
              },
            ]}
          />
          <DatePickerWithRange
            initialFilter={filterDateId}
            onSelectDate={(date, filterId) => {
              setFilters({
                from: date?.from,
                to: date?.to,
                filterDateId: filterId || filterDateId,
              });
            }}
            date={{
              from: period.from || undefined,
              to: period.to || undefined,
            }}
          />
        </div>

        <ModalConfirm
          onContinue={() => {
            if (walletId) deleteWalletMutation.mutate({ walletId });
          }}
          open={openConfirmeDelete}
          setOpen={setOpenConfirmDelete}
        />
      </section>
      <section className="bg-white flex flex-col items-end">
        <Paragraph className="text-sm font-light text-gray-600">
          Saldo atual (R$)
        </Paragraph>
        <Paragraph
          data-positive={props.walletBalance! > 0}
          data-negative={props.walletBalance! < 0}
          className="text-lg font-semibold"
        >
          {props.walletBalance
            ?.toLocaleString("pt-BR", {
              currency: "BRL",
              style: "currency",
            })
            .replace("R$", "")}
        </Paragraph>
      </section>
    </header>
  );
};
