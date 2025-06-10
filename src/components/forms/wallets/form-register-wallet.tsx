"use client";

import { useServerActionMutation } from "@/app/actions/query-key-factory";
import { registerWallet } from "@/app/actions/wallets";
import { registerWalletInputSchema } from "@/app/actions/wallets/schema";
import { AccordionBase } from "@/components/accordion/common/accordion-base";
import { FormDefault } from "@/components/forms/common/form-default";
import { MoneyInputForm } from "@/components/inputs/common/money-input-form";
import { TextInputForm } from "@/components/inputs/common/text-input.form";
import { SectionModal } from "@/components/modais/common/section-modal";
import { SelectBankInputForm } from "@/components/selects/common/select-bank-input-form";
import { FormRegisterPartnerSkeleton } from "@/components/skeletons/partners/form-register-partner-skeleton";
import { Toast } from "@/components/toast";
import { REGISTER_WALLET_MODAL_NAME } from "@/constants";
import { type FormHandlesRef, useFormHandlesRef } from "@/hooks/use-form-ref";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useWallet } from "@/hooks/use-wallet";
import { forwardRef, useEffect, useRef } from "react";

type Props = {
  onFinish(): void;
};

export const FormRegisterWallet = forwardRef<FormHandlesRef, Props>(
  (props, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const { typeToCreate, walletId, wallet } = useWallet();
    const isPending = false;
    const registerWalletAction = useServerActionMutation(registerWallet, {
      mutationKey: ["register-wallet"],
      onSuccess() {
        props.onFinish();
      },
      onError(error) {
        Toast.error("Erro ao registrar conta bancária", error.message);
      },
    });

    const form = useFormSchema({
      schema: registerWalletInputSchema,
      defaultValues: {
        bankCode: "",
        name: "",
        balance: 0,
        agency: "",
        number: "",
        type: typeToCreate,
      },
    });

    useEffect(() => {
      if (wallet) {
        // form.reset(WalletMapper.toForm(wallet));
      }
    }, [wallet]);

    useFormHandlesRef({
      ref,
      progressStatus: registerWalletAction.status === "pending",
    });

    if (isPending && walletId) {
      return <FormRegisterPartnerSkeleton />;
    }

    return (
      <FormDefault
        form={form}
        ref={formRef}
        onSubmit={form.handleSubmit((values) =>
          registerWalletAction.mutate({
            ...values,
            walletId,
          })
        )}
        id={REGISTER_WALLET_MODAL_NAME}
      >
        <SectionModal>
          <div className="flex w-full gap-4">
            <SelectBankInputForm name="bankCode" required label="Banco" />
            <TextInputForm name="name" label="Nome da conta" />
            <MoneyInputForm
              disabled={!!walletId}
              name="balance"
              label="Saldo final bancário"
            />
          </div>
          <AccordionBase title="Mais detalhes" id="more">
            <TextInputForm name="agency" label="Agência" />
            <TextInputForm name="number" label="Conta" />
          </AccordionBase>
        </SectionModal>
      </FormDefault>
    );
  }
);
