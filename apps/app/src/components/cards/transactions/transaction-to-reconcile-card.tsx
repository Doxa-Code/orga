"use client";
import { searchTransaction } from "@/app/actions/transactions";
import { REGISTER_TRANSACTION_MODAL_NAME } from "@/constants";
import { useModais } from "@/hooks/use-modais";
import {
  type TransactionToReconcile,
  useTransaction,
} from "@/hooks/use-transaction";
import { TransactionType } from "@orga/core/domain";
import { Card, CardContent, CardFooter, CardHeader } from "@orgard";
import { Button } from "@orgatton";
import { useServerAction } from "zsa-react";
import { Paragraph } from "../../common/typograph";
import { DateText } from "../../text/date-text";
import { MoneyText } from "../../text/money-text";

type Props = {
  transaction?: TransactionToReconcile | null;
};

export const TransactionToReconcileCard: React.FC<Props> = (props) => {
  const { toggleModalName } = useModais();
  const { set, unlinkTransaction, linkTransaction } = useTransaction();
  const searchTransactionAction = useServerAction(searchTransaction);

  return (
    <Card
      data-hidden={!props.transaction}
      className="border border-gray-300 w-full flex flex-col rounded"
    >
      <CardHeader className="flex border-b border-gray-300 py-3 px-4 justify-between items-center flex-row">
        <MoneyText
          amount={
            props?.transaction?.type === TransactionType.DEBIT
              ? props?.transaction?.amount! * -1
              : props?.transaction?.amount!
          }
        />
        <DateText date={props?.transaction?.dueDate} />
      </CardHeader>
      <CardContent className="py-3 flex flex-col flex-1 border-b border-gray-300">
        <section className="flex-1 pb-6">
          <Paragraph>{props?.transaction?.description}</Paragraph>
        </section>
        <section className="grid grid-cols-2 py-2">
          <div
            data-hidden={!props?.transaction?.partnerName}
            className="flex gap-2"
          >
            <Paragraph className="font-semibold text-xs">
              {props?.transaction?.type === TransactionType.CREDIT
                ? "Cliente:"
                : "Fornecedor:"}
            </Paragraph>
            <Paragraph className="text-xs">
              {props?.transaction?.partnerName}
            </Paragraph>
          </div>

          <div className="flex gap-2">
            <Paragraph className="font-semibold text-xs">Categoria:</Paragraph>
            <Paragraph className="text-xs">
              {props?.transaction?.category}
            </Paragraph>
          </div>
        </section>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 items-center flex-row py-3">
        <Button
          disabled={!props?.transaction?.id}
          onClick={() => {
            set({
              transactionId: props?.transaction?.transactionId,
              async onFinishRegister() {
                const [transactions] = await searchTransactionAction.execute({
                  id: props?.transaction?.transactionId!,
                });

                const transaction = transactions?.[0] || null;

                if (transaction) {
                  linkTransaction({
                    ...transaction,
                    transactionFromOFXId:
                      props?.transaction?.transactionFromOFXId!,
                  });
                }
              },
            });
            toggleModalName(REGISTER_TRANSACTION_MODAL_NAME);
          }}
          variant="outline"
          className="p-3 h-7 text-sky-900 font-semibold"
        >
          Editar
        </Button>
        <Button
          disabled={!props.transaction}
          onClick={() => {
            unlinkTransaction(props.transaction?.transactionFromOFXId);
          }}
          variant="outline"
          className="p-3 h-7 text-sky-900 font-semibold"
        >
          Desvincular
        </Button>
      </CardFooter>
    </Card>
  );
};
