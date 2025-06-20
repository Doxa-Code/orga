import { addDays } from "date-fns";
import type { PaymentOutputDTO } from "./create-payment-by-condition-presentation";

export class EditPaymentsValuesPresentation {
  private static sanatize(value: number) {
    return isNaN(value) || !isFinite(value) ? 0 : value;
  }

  static changeTotalAmount(input: ChangeTotalAmountInputDTO) {
    const totalCents = Math.round(input.total * 100);
    const baseInstallmentValue = Math.floor(totalCents / input.payments.length);
    const remainder = totalCents % input.payments.length;

    return input.payments.map((payment, i) => {
      const isLast = i === input.payments.length - 1;

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
        dueDate: payment.dueDate,
        description: payment.description,
        paymentMethod: payment.paymentMethod,
        walletId: payment.walletId,
      };
    });
  }

  static changeAmount(input: InputDTO) {
    const totalCents = Math.round(input.total * 100);
    const currentPaymentAmount = Math.round(input.value * 100);
    let total = totalCents - currentPaymentAmount;
    total = total < 0 ? 0 : total;

    return input.payments.map((payment, i) => {
      const isLast = i === input.payments.length - 1;

      let amount = Math.round(payment.amount * 100);

      if (!isLast && i !== input.index) {
        total -= amount;
        return payment;
      }

      if (i === input.index) {
        amount = currentPaymentAmount;
      }

      if (isLast) {
        amount = total;
      }

      amount = amount < 0 ? 0 : amount;

      const percentage = Number(((amount * 100) / totalCents).toFixed(1));

      return {
        ...payment,
        amount: this.sanatize(amount / 100),
        percentage: this.sanatize(percentage),
      };
    });
  }
  static changePercentage(input: InputDTO) {
    const totalCents = Math.round(input.total * 100);
    const currentPaymentAmount = (totalCents * input.value) / 100;
    let total = totalCents - currentPaymentAmount;
    total = total < 0 ? 0 : total;
    const baseInstallmentValue = Math.floor(
      total / (input.payments.length - 1),
    );
    const remainder = total % (input.payments.length - 1);

    return input.payments.map((payment, i) => {
      const isLast = i === input.payments.length - 1;

      const value =
        i === input.index
          ? currentPaymentAmount
          : isLast
            ? baseInstallmentValue + remainder
            : baseInstallmentValue;

      const percentage = Number(
        (value === 0 ? 0 : (value * 100) / totalCents).toFixed(1),
      );

      const amount = value === 0 ? 0 : value / 100;

      return {
        ...payment,
        amount: this.sanatize(amount),
        percentage: this.sanatize(percentage),
      };
    });
  }

  static changeInterval(input: ChangeIntervalInputDTO) {
    return input.payments.map((payment, index) => ({
      ...payment,
      dueDate:
        index === 0
          ? payment.dueDate
          : addDays(input.payments[0]!.dueDate, input.interval * index),
    }));
  }

  static changePaymentMethod(input: ChangePaymentMethodInputDTO) {
    return input.payments.map((payment) => ({
      ...payment,
      paymentMethod: payment.paymentMethod || input.paymentMethod,
    }));
  }

  static changeDueDate(input: ChangeDueDateInputDTO) {
    return input.payments.map((payment, index) => ({
      ...payment,
      dueDate:
        index === 0
          ? input.dueDate
          : addDays(input.dueDate, input.interval * index),
    }));
  }
}

type ChangeIntervalInputDTO = {
  payments: PaymentOutputDTO[];
  interval: number;
};

type ChangePaymentMethodInputDTO = {
  payments: PaymentOutputDTO[];
  paymentMethod: string;
};

type ChangeDueDateInputDTO = {
  payments: PaymentOutputDTO[];
  interval: number;
  dueDate: Date;
};

type ChangeTotalAmountInputDTO = {
  payments: PaymentOutputDTO[];
  total: number;
};

type InputDTO = {
  payments: PaymentOutputDTO[];
  index: number;
  value: number;
  total: number;
};
