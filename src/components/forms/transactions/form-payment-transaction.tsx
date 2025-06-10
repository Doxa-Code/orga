"use client";
import { useServerActionMutation } from "@/app/actions/query-key-factory";
import { makePaymentOnTransaction } from "@/app/actions/transactions";
import { paymentTransactionInputSchema } from "@/app/actions/transactions/schema";
import { FormDefault } from "@/components/forms/common/form-default";
import { DateInputForm } from "@/components/inputs/common/date-input.form";
import { InputMoney } from "@/components/inputs/common/input-money";
import { MoneyInputForm } from "@/components/inputs/common/money-input-form";
import { SectionModal } from "@/components/modais/common/section-modal";
import { SelectPaymentMethodInputForm } from "@/components/selects/common/select-payment-method-input-form";
import { SelectWalletInputForm } from "@/components/selects/wallets/select-wallet-input-form";
import { FormPaymentTransactionSkeleton } from "@/components/skeletons/transactions/form-payment-transaction-skeleton";
import { FormItem, FormLabel } from "@/components/ui/form";
import { PAYMENT_METHOD, PAYMENT_TRANSACTION_MODAL_NAME } from "@/constants";
import { type FormHandlesRef, useFormHandlesRef } from "@/hooks/use-form-ref";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useTransaction } from "@/hooks/use-transaction";
import { forwardRef, useEffect, useState } from "react";

type Props = {
  onFinish(): void;
};

export const FormPaymentTransaction = forwardRef<FormHandlesRef, Props>(
  (props, ref) => {
    const { paymentId, transactionId } = useTransaction();
    const [amountPaided, setAmountPaided] = useState(0);
    const form = useFormSchema({
      schema: paymentTransactionInputSchema,
      defaultValues: {
        amountPaided: 0,
        paymentDate: new Date(),
        paymentId: paymentId!,
        transactionId: transactionId!,
        paymentMethod: PAYMENT_METHOD[0]?.name,
      },
    });

    form.watch((values) => {
      setAmountPaided(Number(values.amountPaided));
    });

    const makePaymentOnTransactionAction = useServerActionMutation(
      makePaymentOnTransaction,
      {
        mutationKey: ["make-payment-on-transaction"],
        onSuccess: props.onFinish,
      }
    );

    useFormHandlesRef({
      ref,
      progressStatus: makePaymentOnTransactionAction.status === "pending",
    });

    // const payment = transaction?.payments.find(
    //   (payment) => payment.id === paymentId
    // );

    // useEffect(() => {
    //   if (transaction && payment) {
    //     const formDefaultValues = TransactionMapper.toFormPayment(
    //       transaction,
    //       paymentId!,
    //       PAYMENT_METHOD[0]!.name
    //     );

    //     form.reset(formDefaultValues);
    //     setAmountPaided(formDefaultValues.amountPaided);
    //   }
    // }, [transaction, paymentId]);

    // if (isLoadingTransaction) {
    //   return <FormPaymentTransactionSkeleton />;
    // }

    return (
      <FormDefault
        form={form}
        onSubmit={form.handleSubmit((values) =>
          makePaymentOnTransactionAction.mutate({
            ...values,
            paymentId: paymentId!,
            transactionId: transactionId!,
          })
        )}
        id={PAYMENT_TRANSACTION_MODAL_NAME}
      >
        <SectionModal title="Dados do pagamento">
          <div className="flex w-full gap-6">
            {/* <Field
              label="Vencimento"
              value={payment?.dueDate?.toLocaleDateString("pt-BR")}
            /> */}
            {/* <Field
              label="Status"
              data-negative={payment?.status === PaymentStatus.NO_PAID}
              data-positive={payment?.status === PaymentStatus.PAID}
              value={
                payment?.status === PaymentStatus.PAID ? "Pago" : "Não Pago"
              }
            />
            <Field label="Descrição" value={payment?.description} /> */}
          </div>
        </SectionModal>

        <SectionModal title="Informações de pagamento">
          <FormItem>
            <FormLabel>Valor</FormLabel>
            {/* <InputMoney disabled value={Number(payment?.amount)} /> */}
          </FormItem>

          <DateInputForm
            name="paymentDate"
            label="Data do pagamento"
            required
          />
          <MoneyInputForm name="amountPaided" label="Valor pago" required />
          <SelectPaymentMethodInputForm
            name="paymentMethod"
            label="Forma de pagamento"
            required
          />
          <SelectWalletInputForm
            name="walletId"
            required
            // transactionType={transaction?.type}
          />
          {/* <FooterCalculateRemaningAmount
            amount={payment?.amount}
            amountPaided={amountPaided}
          /> */}
        </SectionModal>
      </FormDefault>
    );
  }
);
