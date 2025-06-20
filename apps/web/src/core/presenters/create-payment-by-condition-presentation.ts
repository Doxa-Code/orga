import { addDays } from "date-fns";

export class CreatePaymentByConditionPresentation {
  static create(input: InputDTO): PaymentOutputDTO[] {
    const totalCents = Math.round(input.amount * 100);
    const baseInstallmentValue = Math.floor(
      totalCents / input.installmentCount,
    );
    const remainder = totalCents % input.installmentCount;

    return Array.from({ length: input.installmentCount }).map((_, i) => {
      const isLast = i === input.installmentCount - 1;

      const value = isLast
        ? baseInstallmentValue + remainder
        : baseInstallmentValue;

      const percentage = Number(
        (value === 0 ? 0 : (value * 100) / totalCents).toFixed(1),
      );

      const amount = value === 0 ? 0 : value / 100;

      return {
        amount,
        percentage,
        dueDate: addDays(input.dueDate, input.installmentInterval * i),
        description: input.description
          ? `${input.description} ${i + 1}/${input.installmentCount}`
          : "",
        paymentMethod: "",
        walletId: "",
      };
    });
  }
}

type InputDTO = {
  dueDate: Date;
  installmentCount: number;
  installmentInterval: number;
  amount: number;
  description?: string;
};

export type PaymentOutputDTO = {
  dueDate: Date;
  amount: number;
  percentage: number;
  paymentMethod: string;
  walletId: string;
  description: string;
};
