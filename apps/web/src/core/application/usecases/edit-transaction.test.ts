import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { TestFactory } from "../../infra/factories/test-factory";
import { TransactionFactory } from "../../infra/factories/transaction-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const deleteAccountUser = UserFactory.deleteAccountUser();
const bankRepository = TestFactory.bankRepository();
const editTransaction = TransactionFactory.edit();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;
let walletId: string;
let bankCode: string;
let transactionId: string;

beforeAll(async () => {
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;

  const wallet = await TestFactory.createWallet(
    user.id,
    user.workspaces[0]?.id!,
  );
  walletId = wallet.id;
  bankCode = wallet.bank.code;

  const transaction = await TestFactory.createTransaction(
    user.id,
    wallet.id,
    user.workspaces[0]?.id!,
    true,
  );
  transactionId = transaction.id;
});

afterAll(async () => {
  await bankRepository.delete(bankCode);
  await deleteAccountUser.execute(user?.id);
  await deleteAccountUser.execute(userInvalid?.id);
});

test("transaction not found", () => {
  expect(
    async () =>
      await editTransaction.execute({
        transactionId: "any",
        description: "CHANGE",
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: walletId,
      }),
  ).rejects.toThrowError(new EntityNotFound("transaction"));
});

test("cost center not found", () => {
  expect(
    async () =>
      await editTransaction.execute({
        transactionId,
        costCenterId: "any",
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: walletId,
      }),
  ).rejects.toThrowError(new EntityNotFound("cost center"));
});

test("category not found", async () => {
  expect(
    async () =>
      await editTransaction.execute({
        transactionId,
        userId: user.id,
        categorySequence: "1231231.1231231231231231",
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: walletId,
      }),
  ).rejects.toThrowError(new EntityNotFound("category"));
});

test("edit transaction", async () => {
  const date = new Date();
  const transaction = await editTransaction.execute({
    transactionId,
    description: "CHANGE",
    categorySequence: "2.1",
    userId: user.id,
    defaultInstallmentWalletId: walletId,
    installmentCount: 2,
    installmentInterval: 30,
    defaultInstallmentDueDate: date,
    paided: false,
    amount: 0,
  });
  expect(transaction.description).toBe("CHANGE");
  expect(transaction.status).toBe("no paid");
  expect(transaction.amount).toBe(0);
});
