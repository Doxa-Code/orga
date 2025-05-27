export namespace Payment {
  export type Status = "PAID" | "NO_PAID";
  export type Method =
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "PIX"
    | "BANK_TRANSFER"
    | "CASH"
    | "BANK_CHECK"
    | "BANK_SLIP"
    | "OTHERS";
  export interface Props {
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
    status: Status;
    paidedDate: Date | null | undefined;
    amountPaided: number;
  }
}

type PaymentInputDTO = {
  dueDate: Date;
  amount: number;
  percentage: number;
  walletId: string;
  paymentMethod?: Payment.Method;
  description?: string;
  fees?: number;
  fine?: number;
  status?: Payment.Status;
};

export class Payment {
  public id: string;
  public dueDate: Date;
  public amount: number;
  public percentage: number;
  public paymentMethod: Payment.Method;
  public walletId: string;
  public description: string;
  public fees: number;
  public fine: number;
  public createdAt: Date;
  public status: Payment.Status;
  public paidedDate: Date | null | undefined;
  public amountPaided: number;

  constructor(props: Payment.Props) {
    this.id = props.id;
    this.dueDate = props.dueDate;
    this.amount = props.amount;
    this.percentage = props.percentage;
    this.paymentMethod = props.paymentMethod;
    this.walletId = props.walletId;
    this.description = props.description;
    this.fees = props.fees;
    this.fine = props.fine;
    this.createdAt = props.createdAt;
    this.status = props.status;
    this.paidedDate = props.paidedDate;
    this.amountPaided = props.amountPaided;
  }

  static instance(props: Payment.Props) {
    return new Payment(props);
  }

  static create(input: PaymentInputDTO) {
    const isPaided = input.status === "PAID";
    const payment = new Payment({
      id: crypto.randomUUID().toString(),
      dueDate: input.dueDate || new Date(),
      amount: Math.abs(input.amount || 0),
      percentage: input.percentage || 0,
      paymentMethod: "OTHERS",
      walletId: input.walletId || "",
      description: input.description || "",
      fees: input.fees || 0,
      fine: input.fine || 0,
      createdAt: new Date(),
      status: input.status || "NO_PAID",
      paidedDate: null,
      amountPaided: 0,
    });

    if (isPaided) {
      payment.pay(payment.amount, input.paymentMethod);
    }

    return payment;
  }

  pay(amount: number, paymentMethod?: Payment.Method, paidedDate?: Date) {
    this.amountPaided = amount;
    this.paidedDate = paidedDate || new Date();
    this.paymentMethod = paymentMethod || "OTHERS";
    this.status = this.amountPaided >= this.amount ? "PAID" : "NO_PAID";
  }
}
