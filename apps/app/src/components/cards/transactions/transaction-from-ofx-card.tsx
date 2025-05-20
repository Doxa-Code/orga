"use client";
import type { TransactionFromOFX } from "@/hooks/use-transaction";
import { TransactionType } from "@orga/core/domain";
import { Card, CardContent, CardFooter, CardHeader } from "@orgard";
import { Button } from "@orgatton";
import { Paragraph } from "../../common/typograph";
import { DateText } from "../../text/date-text";
import { MoneyText } from "../../text/money-text";

type Props = {
  transaction?: TransactionFromOFX;
  onIgnore(): void;
};

export const TransactionFromOFXCard: React.FC<Props> = ({
  transaction,
  ...props
}) => {
  return (
    <Card className="border border-gray-300 h-screen max-h-[300px] w-full flex flex-col rounded">
      <CardHeader className="flex border-b border-gray-300 py-3 px-4 justify-between items-center flex-row">
        <DateText date={transaction?.date} />
        <MoneyText
          amount={
            transaction?.type === TransactionType.DEBIT
              ? transaction?.amount! * -1
              : transaction?.amount!
          }
        />
      </CardHeader>
      <CardContent className="py-3 flex-1 border-b border-gray-300">
        <Paragraph>{transaction?.description}</Paragraph>
      </CardContent>
      <CardFooter className="flex justify-end items-center flex-row py-3">
        <Button
          onClick={() => props.onIgnore?.()}
          variant="outline"
          className="p-3 h-7 text-sky-900 font-semibold"
        >
          Ignorar
        </Button>
      </CardFooter>
    </Card>
  );
};
