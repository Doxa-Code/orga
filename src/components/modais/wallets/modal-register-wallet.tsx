"use client";

import { FormRegisterWallet } from "@/components/forms/wallets/form-register-wallet";
import { ModalDefault } from "@/components/modais/common/modal-default";
import { REGISTER_WALLET_MODAL_NAME } from "@/constants";
import type { FormHandlesRef } from "@/hooks/use-form-ref";
import { useModais } from "@/hooks/use-modais";
import { useWallet } from "@/hooks/use-wallet";
import { useRouter } from "next/navigation";
import * as React from "react";

export function ModalRegisterWallet() {
  const { walletId } = useWallet();
  const { closeModal } = useModais();
  const formRef = React.useRef<FormHandlesRef>(null);
  const router = useRouter();

  return (
    <ModalDefault
      modalName={REGISTER_WALLET_MODAL_NAME}
      title={walletId ? "Editar conta financeira" : "Novo conta financeira"}
    >
      <FormRegisterWallet
        ref={formRef}
        onFinish={() => {
          closeModal(REGISTER_WALLET_MODAL_NAME);
          router.refresh();
        }}
      />
    </ModalDefault>
  );
}
