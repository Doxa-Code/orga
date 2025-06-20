import { FieldInvalid } from "../errors/field-invalid";
import { FieldMissing } from "../errors/field-missing";
import { CostCenter } from "../valueobjects/cost-center";
import { TransactionCategory } from "../valueobjects/transaction-category";
import type { Payment } from "./payment";

export namespace Transaction {
  export type Type = "CREDIT" | "DEBIT";

  export type Status = "PAID" | "NO_PAID" | "OVERDUE" | "PAID_TODAY";
  export interface Props {
    id: string;
    workspaceId: string;
    description: string;
    amount: number;
    dueDate: Date;
    type: Type;
    status: Status;
    costCenter: CostCenter;
    category: TransactionCategory;
    payments: Payment[];
    note: string;
    partnerId?: string | null;
  }
}

type CreateInputDTO = {
  description: string;
  workspaceId: string;
  amount: number;
  type: Transaction.Type;
  costCenter?: { id: string; name: string };
  category?: { sequence: string; name: string };
  dueDate?: Date;
  note?: string;
  partnerId?: string | null;
};

type UpdateInputDTO = {
  description?: string;
  amount?: number;
  dueDate?: Date;
  costCenter?: { id: string; name: string };
  category?: { sequence: string; name: string };
  note?: string;
  partnerId?: string | null;
};

export class Transaction {
  public id: string;
  public workspaceId: string;
  public description: string;
  public amount: number;
  public dueDate: Date;
  public type: Transaction.Type;
  public costCenter: CostCenter;
  public category: TransactionCategory;
  private _payments: Map<string, Payment>;
  public note: string;
  public partnerId?: string | null;

  constructor(props: Omit<Transaction.Props, "status">) {
    this.id = props.id;
    this.workspaceId = props.workspaceId;
    this.description = props.description;
    this.amount = props.amount;
    this.dueDate = props.dueDate;
    this.type = props.type;
    this.costCenter = props.costCenter;
    this.category = props.category;
    this.payments = props.payments;
    this.note = props.note;
    this.partnerId = props.partnerId;
  }

  get status() {
    return Math.abs(this.amountPaided) >= Math.abs(this.amount) &&
      this.amount > 0
      ? "PAID"
      : "NO_PAID";
  }

  set payments(payments: Payment[]) {
    if (!this._payments) {
      this._payments = new Map();
    }
    for (const payment of payments) {
      this._payments.set(payment.id, payment);
    }
  }

  get payments() {
    return Array.from(this._payments.values());
  }

  static instance(props: Transaction.Props) {
    return new Transaction(props);
  }

  static create(input: CreateInputDTO) {
    const dueDateNow = input.dueDate || new Date();
    dueDateNow.setHours(0, 0, 0, 0);

    if (!input.workspaceId) {
      throw new FieldMissing("workspace ID");
    }

    if (!input.type) {
      throw new FieldMissing("type");
    }

    if (!input.type) {
      throw new FieldInvalid("type");
    }

    return new Transaction({
      amount: Math.abs(input.amount || 0),
      category: TransactionCategory.create(
        input.category?.sequence,
        input.category?.name,
      ),
      costCenter: CostCenter.create(
        input.costCenter?.id,
        input.costCenter?.name,
      ),
      description: input.description || "",
      dueDate: dueDateNow,
      id: crypto.randomUUID().toString(),
      type: input.type,
      workspaceId: input.workspaceId,
      payments: [],
      note: input.note || "",
      partnerId: input.partnerId || null,
    });
  }

  update(input: UpdateInputDTO) {
    this.amount = typeof input.amount === "number" ? input.amount : this.amount;
    this.category = input.category
      ? TransactionCategory.create(
          input?.category?.sequence,
          input?.category?.name,
        )
      : this.category;
    this.costCenter = input.costCenter
      ? CostCenter.create(input.costCenter.id, input.costCenter.name)
      : this.costCenter;
    this.description = input.description || this.description;
    this.dueDate = input.dueDate || this.dueDate;
    this.note = input.note || this.note;
    this.partnerId = input.partnerId || this.partnerId;
  }

  selectCostCenter(id: string, name: string) {
    this.costCenter = CostCenter.create(id, name);
  }

  selectCategory(sequence: string, name: string) {
    this.category = TransactionCategory.create(sequence, name);
  }

  get amountPaided() {
    let result = 0;
    for (const payment of this.payments) {
      if (payment.status === "PAID") {
        result += payment.amount;
      }
    }
    return result;
  }

  addPayment(payment: Payment) {
    this._payments.set(payment.id, payment);
  }

  clearPayments() {
    this._payments.clear();
  }

  getPayment(paymentId: string) {
    return this._payments.get(paymentId);
  }

  updatePayment(payment: Payment) {
    this._payments.set(payment.id, payment);
  }
}
