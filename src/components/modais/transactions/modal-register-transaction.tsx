"use client";
import { FormRegisterTransaction } from "@/components/forms/transactions/form-register-transaction";
import { ModalDefault } from "@/components/modais/common/modal-default";
import { REGISTER_TRANSACTION_MODAL_NAME } from "@/constants";
import { useModais } from "@/hooks/use-modais";
import { useTransaction } from "@/hooks/use-transaction";

export async function ModalRegisterTransaction() {
  const { transactionId, typeToCreate } = useTransaction();
  const { closeModal } = useModais();

  return (
    <ModalDefault
      modalName={REGISTER_TRANSACTION_MODAL_NAME}
      title={
        transactionId
          ? typeToCreate === "CREDIT"
            ? "Editar receita"
            : "Editar despesa"
          : typeToCreate === "CREDIT"
            ? "Nova receita"
            : "Nova despesa"
      }
    >
      <FormRegisterTransaction
        onFinish={() => {
          closeModal(REGISTER_TRANSACTION_MODAL_NAME);
        }}
      />
    </ModalDefault>
  );
}
