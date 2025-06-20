"use client";

import { FormPaymentTransaction } from "@/components/forms/transactions/form-payment-transaction";
import { ModalDefault } from "@/components/modais/common/modal-default";
import { PAYMENT_TRANSACTION_MODAL_NAME } from "@/constants";
import type { FormHandlesRef } from "@/hooks/use-form-ref";
import { useModais } from "@/hooks/use-modais";
import { useTransaction } from "@/hooks/use-transaction";
import { useRouter } from "next/navigation";
import * as React from "react";

export function ModalPaymentTransaction() {
  const { closeModal } = useModais();
  const formRef = React.useRef<FormHandlesRef>(null);
  const router = useRouter();
  const { set } = useTransaction();

  return (
    <ModalDefault
      modalName={PAYMENT_TRANSACTION_MODAL_NAME}
      title="Registrar pagamento"
    >
      <FormPaymentTransaction
        onFinish={() => {
          closeModal(PAYMENT_TRANSACTION_MODAL_NAME);
          set({
            transactionId: null,
            paymentId: null,
          });
          router.refresh();
        }}
        ref={formRef}
      />
    </ModalDefault>
  );
}
