import type { Transaction } from "../../domain/entities/transaction";
import type { Wallet } from "../../domain/entities/wallet";
import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { NotPermission } from "../../domain/errors/not-permission";
import { TestFactory } from "../../infra/factories/test-factory";
import { TransactionFactory } from "../../infra/factories/transaction-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const deleteAccount = UserFactory.deleteAccountUser();
const createTransaction = TransactionFactory.create();
const retrieveTransaction = TransactionFactory.retrieve();
const bankRepository = TestFactory.bankRepository();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;
let wallet: Wallet;
let bankCode: string;
let transaction: Transaction;

beforeAll(async () => {
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;

  wallet = await TestFactory.createWallet(user.id, user.workspaces[0]!.id);
  bankCode = wallet.bank.code;

  transaction = await createTransaction.execute({
    amount: 100,
    description: "any",
    dueDate: new Date(),
    type: "CREDIT",
    userId: user.id,
    workspaceId: user.workspaces[0]!.id,
    defaultInstallmentWalletId: wallet.id,
    categorySequence: "1.1",
    defaultInstallmentDueDate: new Date(),
  });
});

afterAll(async () => {
  await bankRepository.delete(bankCode);
  await deleteAccount.execute(user?.id);
  await deleteAccount.execute(userInvalid?.id);
});

test("transaction not found", async () => {
  expect(
    async () => await retrieveTransaction.execute("anyid", user?.id),
  ).rejects.toThrowError(new EntityNotFound("transaction"));
});

test("user not permission", () => {
  expect(
    async () =>
      await retrieveTransaction.execute(transaction.id, userInvalid?.id),
  ).rejects.toThrowError(new NotPermission());
});

test("retrieve transaction", async () => {
  const transactionRetrieved = await retrieveTransaction.execute(
    transaction.id,
    user?.id,
  );
  expect(transactionRetrieved.id).toBe(transaction.id);
});
