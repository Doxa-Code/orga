import { CreatePaymentByConditionPresentation } from "./create-payment-by-condition-presentation";

test("create payment by condition 2 installment", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024/11/13"),
    installmentCount: 2,
    installmentInterval: 30,
    amount: 35941.97,
  });

  expect(payments[0]!.dueDate.toISOString()).toBe(
    new Date("2024/11/13").toISOString(),
  );
  expect(payments[0]!.amount).toBe(17970.98);
  expect(payments[0]!.percentage).toBe(50.0);

  expect(payments[1]!.dueDate.toISOString()).toBe(
    new Date("2024/12/13").toISOString(),
  );
  expect(payments[1]!.amount).toBe(17970.99);
  expect(payments[1]!.percentage).toBe(50.0);
  expect(payments[0]!.amount + payments[1]!.amount).toBe(35941.97);
});

test("create payment by condition 3 installment", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024/11/01"),
    installmentCount: 3,
    installmentInterval: 12,
    amount: 12341.21,
  });

  expect(payments[0]!.dueDate.toISOString()).toBe(
    new Date("2024/11/01").toISOString(),
  );
  expect(payments[0]!.amount).toBe(4113.73);
  expect(payments[0]!.percentage).toBe(33.3);

  expect(payments[1]!.dueDate.toISOString()).toBe(
    new Date("2024/11/13").toISOString(),
  );

  expect(payments[1]!.amount).toBe(4113.73);
  expect(payments[1]!.percentage).toBe(33.3);

  expect(payments[2]!.dueDate.toISOString()).toBe(
    new Date("2024/11/25").toISOString(),
  );

  expect(payments[2]!.amount).toBe(4113.75);
  expect(payments[2]!.percentage).toBe(33.3);
});

test("create payment by condition 4 installment", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024/11/01"),
    installmentCount: 4,
    installmentInterval: 12,
    amount: 4000,
  });

  expect(payments[0]!.dueDate.toISOString()).toBe(
    new Date("2024/11/01").toISOString(),
  );
  expect(payments[0]!.amount).toBe(1000.0);
  expect(payments[0]!.percentage).toBe(25.0);

  expect(payments[1]!.dueDate.toISOString()).toBe(
    new Date("2024/11/13").toISOString(),
  );

  expect(payments[1]!.amount).toBe(1000.0);
  expect(payments[1]!.percentage).toBe(25.0);

  expect(payments[2]!.dueDate.toISOString()).toBe(
    new Date("2024/11/25").toISOString(),
  );

  expect(payments[2]!.amount).toBe(1000.0);
  expect(payments[2]!.percentage).toBe(25.0);

  expect(payments[3]!.dueDate.toISOString()).toBe(
    new Date("2024/12/07").toISOString(),
  );

  expect(payments[3]!.amount).toBe(1000.0);
  expect(payments[3]!.percentage).toBe(25.0);
});

test("create payment by condition 2 installment with 0 amount", () => {
  const payments = CreatePaymentByConditionPresentation.create({
    dueDate: new Date("2024/11/13"),
    installmentCount: 2,
    installmentInterval: 30,
    amount: 0,
    description: "teste",
  });

  expect(payments[0]!.dueDate.toISOString()).toBe(
    new Date("2024/11/13").toISOString(),
  );
  expect(payments[0]!.amount).toBe(0);
  expect(payments[0]!.percentage).toBe(0);
  expect(payments[0]!.description).toBe("teste 1/2");

  expect(payments[1]!.dueDate.toISOString()).toBe(
    new Date("2024/12/13").toISOString(),
  );
  expect(payments[1]!.amount).toBe(0);
  expect(payments[1]!.percentage).toBe(0);
  expect(payments[1]!.description).toBe("teste 2/2");
});
