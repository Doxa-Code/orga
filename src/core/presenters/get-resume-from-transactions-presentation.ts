import { SearchTransactionsOutputDTO } from "../application/usecases/search-transactions";

export class GetResumeFromTransactionsPresentation {
  static create(
    transactions: SearchTransactionsOutputDTO[] | null
  ): ResumeTransactions {
    const resume = {
      credit: 0,
      debit: 0,
      total: 0,
    };

    if (!transactions) {
      return resume;
    }

    for (const transaction of transactions) {
      if (transaction.type === "CREDIT") {
        resume.credit += transaction.amount;
      }
      if (transaction.type === "DEBIT") {
        transaction.amount = transaction.amount * -1;
        resume.debit += transaction.amount;
      }
      resume.total = resume.credit + resume.debit;
    }

    return resume;
  }
}

export type ResumeTransactions = {
  credit: number;
  debit: number;
  total: number;
};
