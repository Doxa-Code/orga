"use client";
import { useServerActionQuery } from "@/app/actions/query-key-factory";
import {
  registerTransaction,
  retrieveTransaction,
} from "@/app/actions/transactions";
import { registerTransactionFormSchema } from "@/app/actions/transactions/schema";
import { CheckboxInputForm } from "@/components/checkboxes/common/checkbox-input-form";
import { FormField } from "@/components/common/form-field";
import { FormFooter } from "@/components/form-footer";
import { FormDefault } from "@/components/forms/common/form-default";
import { DateInputForm } from "@/components/inputs/common/date-input.form";
import { MoneyInputForm } from "@/components/inputs/common/money-input-form";
import { NumberInputForm } from "@/components/inputs/common/number-input.form";
import { TextInputForm } from "@/components/inputs/common/text-input.form";
import { SectionModal } from "@/components/modais/common/section-modal";
import { SelectAccountPlanCategories } from "@/components/selects/common/select-account-plan-categories";
import { SelectCostCenter } from "@/components/selects/common/select-cost-center";
import { SelectPaymentConditionInputForm } from "@/components/selects/common/select-payment-condition-input-form";
import { SelectPaymentMethodInputForm } from "@/components/selects/common/select-payment-method-input-form";
import { SelectPartner } from "@/components/selects/partners/select-partner";
import { SelectWalletInputForm } from "@/components/selects/wallets/select-wallet-input-form";
import { FormRegisterTransactionSkeleton } from "@/components/skeletons/transactions/form-register-transaction-skeleton";
import { CreatePaymentByConditionPresentation } from "@/core/presenters/create-payment-by-condition-presentation";
import { EditPaymentsValuesPresentation } from "@/core/presenters/edit-payments-values-presentation";
import { useFormSchema } from "@/hooks/use-form-schema";
import { usePartner } from "@/hooks/use-partner";
import { useTransaction } from "@/hooks/use-transaction";
import { type ReactNode, useEffect, useMemo } from "react";
import { useServerAction } from "zsa-react";

type Props = {
  footer?: ReactNode;
  onFinish?: () => void;
};

export const FormRegisterTransaction: React.FC<Props> = (props) => {
  const { typeToCreate, transactionId, onFinishRegister, set } =
    useTransaction();
  const { data: transaction, isFetching } = useServerActionQuery(
    retrieveTransaction,
    {
      input: { transactionId: transactionId! },
      queryKey: ["retrieveTransaction"],
      enabled: Boolean(transactionId),
    }
  );

  const { set: setPartner } = usePartner();
  const form = useFormSchema({
    schema: registerTransactionFormSchema,
    // defaultValues: TransactionMapper.toFormRegister(typeToCreate),
  });

  form.watch((values, event) => {
    if (
      event.name === "defaultInstallmentPaymentMethod" &&
      values.defaultInstallmentPaymentMethod
    ) {
      form.setValue(
        "payments",
        EditPaymentsValuesPresentation.changePaymentMethod({
          payments: form.getValues().payments,
          paymentMethod: values.defaultInstallmentPaymentMethod,
        })
      );
    }
    if (event.name === "amount") {
      form.setValue(
        "payments",
        EditPaymentsValuesPresentation.changeTotalAmount({
          payments: form.getValues().payments,
          total: Number(values.amount),
        })
      );
    }
    if (event.name === "installmentCount") {
      generatePayments();
    }
    if (event.name === "defaultInstallmentDueDate") {
      form.setValue(
        "payments",
        EditPaymentsValuesPresentation.changeDueDate({
          payments: form.getValues().payments,
          interval: form.getValues().installmentInterval,
          dueDate: values.defaultInstallmentDueDate!,
        })
      );
    }
    if (event.name === "installmentInterval") {
      form.setValue(
        "payments",
        EditPaymentsValuesPresentation.changeInterval({
          payments: form.getValues().payments,
          interval: Number(values.installmentInterval),
        })
      );
    }
  });

  const classNameBorderSession = useMemo(
    () =>
      typeToCreate === "CREDIT"
        ? "border-t-2 border-t-green-500"
        : "border-t-2 border-t-red-500",
    [typeToCreate]
  );

  const onFinish = async () => {
    if (onFinishRegister) {
      await onFinishRegister();
    }
    set({ transactionId: null });
    props?.onFinish?.();
  };

  const registerTransactionAction = useServerAction(registerTransaction, {
    onFinish,
  });

  useEffect(() => {
    setPartner({
      roleToCreate: typeToCreate === "CREDIT" ? "CUSTOMER" : "SUPPLIER",
    });
  }, [typeToCreate]);

  useEffect(() => {
    if (transactionId && transaction) {
      // form.reset(
      //   TransactionMapper.toFormRegister(transaction.type, transaction)
      // );
    } else {
      // form.reset(TransactionMapper.toFormRegister(typeToCreate));
    }
  }, [transactionId, transaction]);

  function generatePayments() {
    const {
      installmentCount,
      amount,
      defaultInstallmentDueDate,
      installmentInterval,
      description,
    } = form.getValues();

    if (Number(installmentCount) <= 1) {
      form.setValue("payments", []);
      return;
    }

    form.setValue(
      "payments",
      CreatePaymentByConditionPresentation.create({
        amount: amount,
        dueDate: defaultInstallmentDueDate,
        installmentCount: installmentCount,
        installmentInterval: installmentInterval || 30,
        description,
      })
    );
  }

  if (isFetching) {
    return <FormRegisterTransactionSkeleton />;
  }

  return (
    <FormDefault
      form={form}
      onSubmit={form.handleSubmit((values) =>
        registerTransactionAction.execute({
          ...values,
          transactionId,
        })
      )}
    >
      <SectionModal
        className={classNameBorderSession}
        title="Informações do lançamento"
      >
        <div className="flex w-full gap-6">
          <FormField
            label={typeToCreate === "CREDIT" ? "Cliente" : "Fornecedor"}
            className="min-w-[282px]"
            name="partnerId"
          >
            {(field) => <SelectPartner {...field} type={typeToCreate!} />}
          </FormField>
          <DateInputForm name="dueDate" label="Data da competência" />
          <TextInputForm
            name="description"
            className="grow"
            label="Descrição"
            required
          />
          <MoneyInputForm name="amount" label="Valor" />
        </div>
        <div className="flex gap-4">
          <FormField
            name="categorySequence"
            required
            label="Categoria"
            className="w-[282px]"
          >
            {(field) => (
              <SelectAccountPlanCategories
                {...field}
                transactionType={form.getValues().type}
              />
            )}
          </FormField>
          <FormField
            label="Centro de custo"
            name="costCenterId"
            className="w-[282px]"
          >
            {(field) => <SelectCostCenter {...field} />}
          </FormField>
        </div>
      </SectionModal>

      <SectionModal
        className={classNameBorderSession}
        title="Condição de pagamento"
      >
        <SelectPaymentConditionInputForm
          label="Parcelamento"
          name="installmentCount"
          required
        />
        <DateInputForm
          required
          label="Vencimento"
          name="defaultInstallmentDueDate"
        />
        <NumberInputForm
          preventDefault
          label="Intervalo entre as parcelas (dias)"
          name="installmentInterval"
          hidden={form.getValues().installmentCount <= 1}
        />
        <SelectPaymentMethodInputForm
          name="defaultInstallmentPaymentMethod"
          label="Forma de pagamento"
        />
        <SelectWalletInputForm
          name="defaultInstallmentWalletId"
          required
          transactionType={form.getValues().type}
        />
        <CheckboxInputForm
          label={form.getValues().type === "CREDIT" ? "Recebido" : "Pago"}
          name="paided"
          hidden={form.getValues().amount === 0}
        />
        {/* <PaymentSessionInputForm
          hidden={Number(form.getValues().installmentCount) <= 1}
          name="payments"
        /> */}
        {/* <TextAreaInputForm
          className="w-full"
          name="note"
          label="Observações"
          description="Tudo o que for relevante em relação a esse lançamento."
        /> */}
      </SectionModal>
      <FormFooter
        onCancel={() => props?.onFinish?.()}
        textConfirm={transactionId ? "Alterar" : "Cadastrar"}
      />
    </FormDefault>
  );
};
