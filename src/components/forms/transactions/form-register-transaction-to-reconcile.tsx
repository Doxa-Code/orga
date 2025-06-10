"use client";
import { registerTransaction } from "@/app/actions/transactions";
import { registerTransactionFormSchema } from "@/app/actions/transactions/schema";
import { FormField } from "@/components/common/form-field";
import { FormDefault } from "@/components/forms/common/form-default";
import { TextInputForm } from "@/components/inputs/common/text-input.form";
import { SelectAccountPlanCategories } from "@/components/selects/common/select-account-plan-categories";
import { SelectCostCenter } from "@/components/selects/common/select-cost-center";
import { SelectPartner } from "@/components/selects/partners/select-partner";
import { REGISTER_TRANSACTION_MODAL_NAME } from "@/constants";
import { useFormSchema } from "@/hooks/use-form-schema";
import { usePartner } from "@/hooks/use-partner";
import {
  type TransactionFromOFX,
  useTransaction,
} from "@/hooks/use-transaction";
import type React from "react";
import { useEffect } from "react";
import { useServerAction } from "zsa-react";

type Props = {
  onFinish(): void;
  transactionFromOFX?: TransactionFromOFX;
};

export const FormRegisterTransactionToReconcile: React.FC<Props> = (props) => {
  const { typeToCreate, transactionId } = useTransaction();
  const { set } = usePartner();
  const form = useFormSchema({
    schema: registerTransactionFormSchema,
    defaultValues: {
      type: typeToCreate,
      dueDate: new Date(),
      description: "",
      amount: 0,
      categorySequence: undefined,
      costCenterId: undefined,
      installmentCount: 1,
      installmentInterval: 30,
      defaultInstallmentDueDate: new Date(),
      defaultInstallmentPaymentMethod: "",
      defaultInstallmentWalletId: "",
      payments: [],
      note: "",
      paided: false,
      partnerId: null,
      transactionId,
    },
  });

  const registerTransactionAction = useServerAction(registerTransaction, {
    onFinish() {
      props.onFinish();
    },
  });

  useEffect(() => {
    if (props.transactionFromOFX) {
      form.reset({
        amount: props.transactionFromOFX.amount,
        dueDate: props.transactionFromOFX.date,
        description: props.transactionFromOFX.description,
        type: props.transactionFromOFX.type,
      });
    }
  }, [props.transactionFromOFX]);

  useEffect(() => {
    set({
      roleToCreate: typeToCreate === "CREDIT" ? "CUSTOMER" : "SUPPLIER",
    });
  }, [typeToCreate]);

  return (
    <FormDefault
      form={form}
      onSubmit={form.handleSubmit((values) =>
        registerTransactionAction.execute({
          ...values,
          transactionId,
        })
      )}
      id={REGISTER_TRANSACTION_MODAL_NAME}
    >
      <div className="grid grid-cols-2 w-full gap-4">
        <TextInputForm name="description" label="Descrição" required />
        <FormField name="categorySequence" required label="Categoria">
          {(field) => (
            <SelectAccountPlanCategories
              transactionType={form.getValues().type}
              {...field}
            />
          )}
        </FormField>
      </div>
      <div className="grid grid-cols-2 w-full gap-4">
        <FormField className="w-full" name="partnerId">
          {(field) => <SelectPartner {...field} type={typeToCreate!} />}
        </FormField>
        <FormField
          label="Centro de custo"
          name="costCenterId"
          className="w-full"
        >
          {(field) => <SelectCostCenter {...field} />}
        </FormField>
      </div>
    </FormDefault>
  );
};
