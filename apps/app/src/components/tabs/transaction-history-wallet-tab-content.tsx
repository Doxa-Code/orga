import { TableWalletTransactions } from "@/components/tables/wallets/table-wallet-transactions";
import type { TransactionType } from "@orga/core/domain";
import { TabsContent } from "@orgabs";
import { ScrollArea } from "@orgaroll-area";

type Props = {
  wallet:
    | {
        transactions: {
          type: TransactionType;
          date: Date;
          amount: number;
          description: string;
        }[];
        balance: number;
        type: string;
        bankFlag: string;
        surname: string;
      }
    | null
    | undefined;
};

export const TransactionHistoryWalletTabContent: React.FC<Props> = ({
  wallet,
}) => {
  return (
    <TabsContent
      className="flex-1 flex flex-col space-y-4 overflow-hidden"
      value="Movimentações"
    >
      <ScrollArea className="flex-1">
        <TableWalletTransactions transactions={wallet?.transactions || []} />
      </ScrollArea>
    </TabsContent>
  );
};
