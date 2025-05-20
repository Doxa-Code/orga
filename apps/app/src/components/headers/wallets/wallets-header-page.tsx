"use client";

import { ButtonPopover } from "@/components/selects/common/button-popover";
import { REGISTER_WALLET_MODAL_NAME } from "@/constants";
import { useModais } from "@/hooks/use-modais";
import { useWallet } from "@/hooks/use-wallet";
import { WalletType } from "@orga/core/domain";

export function WalletsHeaderPage() {
  const { toggleModalName } = useModais();
  const { set } = useWallet();
  return (
    <div className="w-full flex justify-start items-center">
      <ButtonPopover
        title="Nova conta financeira"
        options={[
          {
            label: "Conta Corrente",
            onSelect() {
              set({
                typeToCreate: WalletType.Corrente,
                wallet: null,
                walletId: null,
              });
              toggleModalName(REGISTER_WALLET_MODAL_NAME);
            },
          },
          {
            label: "Caixinha",
            onSelect() {
              set({
                typeToCreate: WalletType.Caixinha,
                wallet: null,
                walletId: null,
              });
              toggleModalName(REGISTER_WALLET_MODAL_NAME);
            },
          },
          {
            label: "Poupança",
            onSelect() {
              set({
                typeToCreate: WalletType.Poupança,
                wallet: null,
                walletId: null,
              });
              toggleModalName(REGISTER_WALLET_MODAL_NAME);
            },
          },
          {
            label: "Conta Investimento",
            onSelect() {
              set({
                typeToCreate: WalletType.Investimentos,
                wallet: null,
                walletId: null,
              });
              toggleModalName(REGISTER_WALLET_MODAL_NAME);
            },
          },
          {
            label: "Outros",
            onSelect() {
              set({
                typeToCreate: WalletType.Outros,
                wallet: null,
                walletId: null,
              });
              toggleModalName(REGISTER_WALLET_MODAL_NAME);
            },
          },
        ]}
      />
    </div>
  );
}
