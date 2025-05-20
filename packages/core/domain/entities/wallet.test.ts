import { WalletTransaction } from "../valueobjects/wallet-transaction";
import { Wallet } from "./wallet";

test("register transaction", () => {
  const wallet = Wallet.create({
    bank: {
      code: "1",
      color: "1",
      name: "any",
      thumbnail: "",
    },
    name: "Any",
    workspaceId: "1",
    balance: 200,
  });

  expect(wallet.balance).toBe(200);
  expect(wallet.transactions.length).toBe(1);

  wallet.registerTransaction(
    WalletTransaction.create("CREDIT", 200, "1", "any"),
  );

  expect(wallet.balance).toBe(400);
  expect(wallet.transactions.length).toBe(2);

  wallet.registerTransaction(
    WalletTransaction.create("CREDIT", 200, "1", "any"),
  );

  expect(wallet.balance).toBe(600);
  expect(wallet.transactions.length).toBe(3);

  wallet.registerTransaction(
    WalletTransaction.create("DEBIT", 200, "1", "any"),
  );

  expect(wallet.balance).toBe(400);
});
