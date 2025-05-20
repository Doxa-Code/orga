import { Payment } from "../../domain/entities/payment";
import { Transaction } from "../../domain/entities/transaction";
import { CostCenter } from "../../domain/valueobjects/cost-center";
import { TransactionCategory } from "../../domain/valueobjects/transaction-category";
import type { SearchTransactionsOutputDTO } from "../usecases/search-transactions";

export interface TransactionRaw {
  id: string;
  workspaceId: string;
  description: string;
  amount: number;
  dueDate: Date;
  type: Transaction.Type;
  status: Transaction.Status;
  costCenter: { id: string; name: string };
  category: { sequence: string; name: string };
  note: string;
  payments: {
    id: string;
    dueDate: Date;
    amount: number;
    percentage: number;
    paymentMethod: Payment.Method;
    walletId: string;
    description: string;
    fees: number;
    fine: number;
    createdAt: Date;
    status: Payment.Status;
    paidedDate?: Date | null;
    amountPaided: number;
  }[];
  partnerId?: string | null;
}

export interface TransactionOFX {
  TRNTYPE: Transaction.Type;
  DTPOSTED: string;
  TRNAMT: string;
  FITID: string;
  MEMO: string;
}

interface TransactionFromOFX extends TransactionOFX {
  workspaceId: string;
  walletId: string;
}

export class TransactionMapper {
  static toPersist(transaction: Transaction): TransactionRaw {
    return {
      amount: transaction.amount,
      category: {
        name: transaction.category.name,
        sequence: transaction.category.sequence,
      },
      costCenter: {
        id: transaction.costCenter.id,
        name: transaction.costCenter.name,
      },
      description: transaction.description,
      dueDate: transaction.dueDate,
      id: transaction.id,
      status: transaction.status,
      type: transaction.type,
      workspaceId: transaction.workspaceId,
      payments: transaction.payments.map((payment) => ({
        walletId: payment.walletId,
        amount: payment.amount,
        fees: payment.fees,
        fine: payment.fine,
        createdAt: payment.createdAt,
        description: payment.description,
        dueDate: payment.dueDate,
        paymentMethod: payment.paymentMethod,
        percentage: payment.percentage,
        status: payment.status,
        id: payment.id,
        amountPaided: payment.amountPaided,
        paidedDate: payment.paidedDate,
      })),
      note: transaction.note,
      partnerId: transaction.partnerId,
    };
  }

  static toDomain(transaction: TransactionRaw): Transaction {
    return new Transaction({
      amount: transaction.amount,
      category: new TransactionCategory(
        transaction.category.sequence,
        transaction.category.name,
      ),
      costCenter: new CostCenter(
        transaction.costCenter.id,
        transaction.costCenter.name,
      ),
      description: transaction.description,
      dueDate: transaction.dueDate,
      id: transaction.id,
      type: transaction.type,
      workspaceId: transaction.workspaceId,
      note: transaction.note,
      payments: transaction.payments.map(
        (payment) =>
          new Payment({
            dueDate: payment.dueDate,
            amount: payment.amount,
            percentage: payment.percentage,
            paymentMethod: payment.paymentMethod,
            walletId: payment.walletId,
            description: payment.description,
            fees: payment.fees,
            fine: payment.fine,
            createdAt: payment.createdAt,
            status: payment.status,
            id: payment.id,
            amountPaided: payment.amountPaided,
            paidedDate: payment.paidedDate,
          }),
      ),
      partnerId: transaction.partnerId,
    });
  }

  static toFormRegister(
    typeToCreate?: Transaction.Type,
    transaction?: TransactionRaw | null,
  ) {
    if (!transaction) {
      return {
        type: typeToCreate || "CREDIT",
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
        transactionId: undefined,
      };
    }
    return {
      amount:
        transaction.amount < 0 ? transaction.amount * -1 : transaction.amount,
      categorySequence: transaction?.category?.sequence,
      costCenterId: transaction?.costCenter?.id,
      defaultInstallmentDueDate: transaction?.payments?.[0]?.dueDate,
      defaultInstallmentPaymentMethod:
        transaction?.payments?.[0]?.paymentMethod,
      defaultInstallmentWalletId: transaction?.payments?.[0]?.walletId,
      description: transaction?.description,
      dueDate: transaction?.dueDate,
      installmentCount: transaction?.payments?.length,
      installmentInterval: 30,
      paided: transaction?.status === "PAID",
      payments: transaction?.payments
        ?.sort((a: any, b: any) => (a.dueDate > b.dueDate ? 1 : -1))
        ?.map((payment) => ({
          amount: payment.amount,
          description: payment.description,
          dueDate: payment.dueDate,
          paymentMethod: payment.paymentMethod,
          percentage: payment.percentage,
          walletId: payment.walletId,
          id: payment.id,
        })),
      type: transaction.type,
      note: transaction.note,
      partnerId: transaction.partnerId,
    };
  }

  static toFormPayment(
    transaction: TransactionRaw,
    paymentId: string,
    defaultPaymentMethod: string,
  ) {
    const payment = transaction.payments.find(
      (payment) => payment.id === paymentId,
    );

    return {
      amountPaided: payment?.amountPaided || 0,
      paymentDate: payment?.paidedDate || new Date(),
      paymentId,
      transactionId: transaction.id,
      paymentMethod: payment?.paymentMethod || defaultPaymentMethod,
      walletId: payment?.walletId || "",
    };
  }

  private static parseOFXDate(dateString: string) {
    const [datePart, timeZonePart] = dateString.split("[");
    const year = Number(datePart?.substring(0, 4));
    const month = Number(datePart?.substring(4, 6)) - 1;
    const day = Number(datePart?.substring(6, 8));
    const hour = Number(datePart?.substring(8, 10));
    const minute = Number(datePart?.substring(10, 12));
    const second = Number(datePart?.substring(12, 14));

    const timeZoneOffset = timeZonePart
      ? Number(timeZonePart.match(/(-?\d+)/)![0])
      : 0;

    const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));

    const localDate = new Date(
      utcDate.getTime() - timeZoneOffset * 60 * 60 * 1000,
    );

    return localDate;
  }

  static fromOFX(transactionOFX: TransactionFromOFX): Transaction {
    const transaction = Transaction.create({
      amount: Math.abs(Number(transactionOFX.TRNAMT)),
      description: transactionOFX.MEMO,
      type: transactionOFX.TRNTYPE as Transaction.Type,
      workspaceId: transactionOFX.workspaceId,
      dueDate: this.parseOFXDate(transactionOFX.DTPOSTED),
    });

    transaction.addPayment(
      Payment.create({
        amount: Math.abs(Number(transactionOFX.TRNAMT)),
        dueDate: this.parseOFXDate(transactionOFX.DTPOSTED),
        percentage: 100,
        walletId: transactionOFX.walletId,
        description: `${transactionOFX.MEMO} 1/1`,
      }),
    );

    return transaction;
  }

  static cleanSearchTransaction(transaction: SearchTransactionsOutputDTO) {
    return {
      amount: transaction.amount,
      amountPaided: transaction.amountPaided,
      category: transaction.category,
      description: transaction.description,
      dueDate: transaction.dueDate,
      id: transaction.id,
      partnerName: transaction.partnerName,
      status: transaction.status,
      transactionId: transaction.transactionId,
      type: transaction.type,
      walletFlag: transaction.walletFlag,
      walletId: transaction.walletId,
      costCenter: transaction.costCenter,
    };
  }
}
