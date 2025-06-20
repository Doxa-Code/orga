import { CreatePaymentByConditionPresentation } from "./create-payment-by-condition-presentation";
import { EditPaymentsValuesPresentation } from "./edit-payments-values-presentation";

test("edit payments amount", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024/11/13"),
    installmentCount: 2,
    installmentInterval: 30,
    amount: 1000,
  });

  const result = EditPaymentsValuesPresentation.changeAmount({
    payments,
    index: 0,
    value: 23,
    total: 1000,
  });

  expect(result[0]!.amount).toBe(23);
  expect(result[0]!.percentage).toBe(2.3);
  expect(result[1]!.amount).toBe(977);
  expect(result[1]!.percentage).toBe(97.7);
});

test("edit payments amount", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024/11/13"),
    installmentCount: 3,
    installmentInterval: 30,
    amount: 3000,
  });

  const result = EditPaymentsValuesPresentation.changeAmount({
    payments,
    index: 0,
    value: 23,
    total: 3000,
  });

  expect(result[0]!.amount).toBe(23);
  expect(result[0]!.percentage).toBe(0.8);
  expect(result[1]!.amount).toBe(1000);
  expect(result[1]!.percentage).toBe(33.3);
  expect(result[2]!.amount).toBe(1977);
  expect(result[2]!.percentage).toBe(65.9);
});

test("edit payments total amount", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024/11/13"),
    installmentCount: 2,
    installmentInterval: 30,
    amount: 2000,
    description: "teste",
  });

  const result = EditPaymentsValuesPresentation.changeTotalAmount({
    payments,
    total: 4000,
  });

  expect(result[0]!.amount).toBe(2000);
  expect(result[0]!.percentage).toBe(50);
  expect(result[0]!.description).toBe("teste 1/2");
  expect(result[1]!.amount).toBe(2000);
  expect(result[1]!.percentage).toBe(50);
  expect(result[1]!.description).toBe("teste 2/2");
});

test("edit payments percentage", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024/11/13"),
    installmentCount: 2,
    installmentInterval: 30,
    amount: 1000,
  });

  const result = EditPaymentsValuesPresentation.changePercentage({
    payments,
    index: 0,
    value: 20,
    total: 1000,
  });

  expect(result[0]!.amount).toBe(200);
  expect(result[0]!.percentage).toBe(20);
  expect(result[1]!.amount).toBe(800);
  expect(result[1]!.percentage).toBe(80);
});

test("edit payments amount", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024/11/13"),
    installmentCount: 2,
    installmentInterval: 30,
    amount: 0,
  });

  const result = EditPaymentsValuesPresentation.changeAmount({
    payments,
    index: 0,
    value: 20,
    total: 0,
  });

  expect(result[0]!.amount).toBe(20);
  expect(result[0]!.percentage).toBe(0);
  expect(result[1]!.amount).toBe(0);
  expect(result[1]!.percentage).toBe(0);
});

test("edit payments interval", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024-11-13T00:00:00"),
    installmentCount: 3,
    installmentInterval: 30,
    amount: 0,
  });

  const result = EditPaymentsValuesPresentation.changeInterval({
    payments,
    interval: 2,
  });

  expect(result[0]!.dueDate.toISOString()).toBe(
    new Date("2024-11-13T00:00:00").toISOString(),
  );
  expect(result[1]!.dueDate.toISOString()).toBe(
    new Date("2024-11-15T00:00:00").toISOString(),
  );
  expect(result[2]!.dueDate.toISOString()).toBe(
    new Date("2024-11-17T00:00:00").toISOString(),
  );
});

test("edit payments default due date", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024-11-13T00:00:00"),
    installmentCount: 3,
    installmentInterval: 30,
    amount: 0,
  });

  const result = EditPaymentsValuesPresentation.changeDueDate({
    payments,
    dueDate: new Date("2024-11-14T00:00:00"),
    interval: 30,
  });

  expect(result[0]!.dueDate.toISOString()).toBe(
    new Date("2024-11-14T00:00:00").toISOString(),
  );
  expect(result[1]!.dueDate.toISOString()).toBe(
    new Date("2024-12-14T00:00:00").toISOString(),
  );
  expect(result[2]!.dueDate.toISOString()).toBe(
    new Date("2025-01-13T00:00:00").toISOString(),
  );
});
