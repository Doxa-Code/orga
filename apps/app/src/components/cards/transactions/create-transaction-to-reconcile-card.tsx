"use client";
import { SEARCH_TRANSACTION_MODAL_NAME } from "@/constants";
import { useModais } from "@/hooks/use-modais";
import {
  type TransactionFromOFX,
  useTransaction,
} from "@/hooks/use-transaction";
import { Button } from "@orga/ui/button";
import { Card, CardContent, CardHeader } from "@orgard";
import { Search } from "lucide-react";
import { Paragraph } from "../../common/typograph";
import { FormRegisterTransactionToReconcile } from "../../forms/transactions/form-register-transaction-to-reconcile";

type Props = { hidden: boolean; transactionFromOFX?: TransactionFromOFX };

export const CreateTransactionToReconcileCard: React.FC<Props> = (props) => {
  const { toggleModalName } = useModais();
  const { set } = useTransaction();
  return (
    <Card
      data-hidden={props.hidden}
      className="border border-gray-300 w-full flex flex-col rounded"
    >
      <CardHeader className="flex border-b border-gray-300 py-3 px-4 justify-between items-center flex-row">
        <Paragraph className="text-primary px-3 font-bold text-sm py-1 rounded">
          Novo lançamento
        </Paragraph>
        <Button
          onClick={() => {
            set({
              transactionId: props.transactionFromOFX?.id,
            });
            toggleModalName(SEARCH_TRANSACTION_MODAL_NAME);
          }}
          variant="link"
          className="p-0 gap-2 h-7 text-sky-800 hover:no-underline"
        >
          <Search size={14} />
          <Paragraph>Buscar lançamento</Paragraph>
        </Button>
      </CardHeader>
      <CardContent className="py-3 flex flex-col justify-center flex-1 border-gray-300">
        <FormRegisterTransactionToReconcile
          onFinish={() => {}}
          transactionFromOFX={props.transactionFromOFX}
        />
      </CardContent>
    </Card>
  );
};
