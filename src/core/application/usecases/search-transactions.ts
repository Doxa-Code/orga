import { isAfter, isBefore, isEqual } from "date-fns";
import type { Transaction } from "../../domain/entities/transaction";
import type { User } from "../../domain/entities/user";
import type { Query } from "../repositories/transaction-repository";
import { Workspace } from "@/core/domain/entities/workspace";
import { Partner } from "@/core/domain/entities/partner";
import { Wallet } from "@/core/domain/entities/wallet";
import { Payment } from "@/core/domain/entities/payment";

interface TransactionRepository {
  search(query: Query): Promise<Transaction[]>;
}

interface UserRepository {
  retrieve(userId: string): Promise<User | null>;
}

interface WorkspaceRepository {
  retrieveByOwner(ownerId: string): Promise<Workspace[]>;
}

interface PartnerRepository {
  retrieve(id: string): Promise<Partner | null>;
}

interface WalletRepository {
  retrieve(id: string): Promise<Wallet | null>;
}

interface ImageStorageService {
  assigneeImage(key: string): Promise<string>;
}

export class SearchTransactions {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly partnerRepository: PartnerRepository,
    private readonly walletRepository: WalletRepository,
    private readonly imageStorage: ImageStorageService
  ) {}

  async execute(input: InputDTO): Promise<SearchTransactionsOutputDTO[]> {
    const user = await this.userRepository.retrieve(input.userId);

    if (!user) {
      return [];
    }

    const workspaces = await this.workspaceRepository.retrieveByOwner(user.id);

    const query: Query = {
      workspacesId: workspaces.map((wk) => wk.id),
      from: input.from,
      to: input.to,
      q: input.q,
      type: input.type,
      walletId: input.walletId,
      amount: input.amount,
      status: input.status,
      id: input.id,
    };
    // TODO: AAQQUIII
    // const isValidSearch = !query.from && !query.to && ;

    // if (!isValidSearch) {
    //   return [];
    // }

    const transactions = await this.transactionRepository.search(query);

    const payments: SearchTransactionsOutputDTO[] = [];

    for (const transaction of transactions) {
      const partner = transaction.partnerId
        ? await this.partnerRepository.retrieve(transaction.partnerId)
        : null;

      for (const [_, payment] of transaction.payments.entries()) {
        const wallet = await this.walletRepository.retrieve(payment.walletId);
        const paymentOnPeriod =
          query.from && query.to
            ? (isAfter(payment.dueDate, query.from) ||
                isEqual(payment.dueDate, query.from)) &&
              (isBefore(payment.dueDate, query.to) ||
                isEqual(payment.dueDate, query.from))
            : true;

        if (paymentOnPeriod) {
          payments.push({
            amount: payment.amount,
            category: [transaction.category.sequence, transaction.category.name]
              .filter(Boolean)
              .join(" - "),
            costCenter: [transaction.costCenter.id, transaction.costCenter.name]
              .filter(Boolean)
              .join("-"),
            description: payment.description || transaction.description || "-",
            dueDate: payment.dueDate,
            id: payment.id,
            status: payment.status,
            type: transaction.type,
            amountPaided: payment.amountPaided || 0,
            partnerName: partner?.name || "-",
            transactionId: transaction.id,
            walletFlag: wallet?.bank?.thumbnail
              ? await this.imageStorage.assigneeImage(wallet?.bank?.thumbnail)
              : "",
            walletId: wallet?.id || "",
          });
        }
      }
    }

    return payments;
  }
}

export type InputDTO = {
  q?: string;
  walletId?: string;
  type?: Transaction.Type;
  from?: string;
  to?: string;
  userId: string;
  amount?: number;
  status?: Transaction.Status;
  id?: string;
};

export type SearchTransactionsOutputDTO = {
  id: string;
  amount: number;
  amountPaided: number;
  description: string;
  type: Transaction.Type;
  category: string;
  dueDate: Date;
  status: Payment.Status;
  partnerName: string;
  transactionId: string;
  walletFlag: string;
  walletId: string;
  costCenter: string;
};
