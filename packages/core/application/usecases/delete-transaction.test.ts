import { NotPermission } from "../../domain/errors/not-permission";
import { TestFactory } from "../../infra/factories/test-factory";
import { TransactionFactory } from "../../infra/factories/transaction-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const deleteAccountUser = UserFactory.deleteAccountUser();
const bankRepository = TestFactory.bankRepository();
const deleteTransaction = TransactionFactory.delete();
const transactionReposity = TestFactory.transactionRepository();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;
let walletId: string;
let bankCode: string;
let transactionId: string;

beforeAll(async () => {
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;

  const wallet = await TestFactory.createWallet(user.id, user.workspaces[0].id);
  walletId = wallet.id;
  bankCode = wallet.bank.code;

  const transaction = await TestFactory.createTransaction(
    user.id,
    wallet.id,
    user.workspaces[0].id,
    true,
    "CREDIT",
  );
  transactionId = transaction.id;
});

afterAll(async () => {
  await bankRepository.delete(bankCode);
  await deleteAccountUser.execute(user?.id);
  await deleteAccountUser.execute(userInvalid?.id);
});

test("user without permission", () => {
  expect(
    async () =>
      await deleteTransaction.execute({
        transactionId: transactionId,
        userId: userInvalid.id,
      }),
  ).rejects.toThrowError(new NotPermission());
});

test("delete transaction", async () => {
  let transaction = await transactionReposity.retrieve(transactionId);
  expect(transaction).toBeDefined();
  await deleteTransaction.execute({
    transactionId: transactionId,
    userId: user.id,
  });
  transaction = await transactionReposity.retrieve(transactionId);
  expect(transaction).toBe(null);

  const wallet = await TestFactory.walletRepository().retrieve(walletId);
  expect(wallet?.balance).toBe(0);
});
