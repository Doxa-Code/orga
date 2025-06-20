import { Payment } from "./payment";
import { Transaction } from "./transaction";

test("transaction payments", () => {
  const transaction = Transaction.create({
    amount: 200,
    description: "Any transaction",
    type: "CREDIT",
    workspaceId: "1",
  });

  expect(transaction.amountPaided).toBe(0);

  transaction.addPayment(
    Payment.create({
      amount: 10,
      dueDate: new Date(),
      percentage: 5,
      walletId: "1",
      fees: 2,
      status: "PAID",
    }),
  );

  expect(transaction.status).toBe("no paid");
  expect(transaction.amountPaided).toBe(10);

  transaction.addPayment(
    Payment.create({
      amount: 190,
      dueDate: new Date(),
      percentage: 95,
      walletId: "1",
      fees: 0,
      status: "PAID",
    }),
  );

  expect(transaction.amountPaided).toBe(200);
  expect(transaction.status).toBe("PAID");
});
