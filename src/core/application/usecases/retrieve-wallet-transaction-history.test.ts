import { endOfDay, startOfDay } from "date-fns";
import type { Wallet } from "../../domain";
import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { NotPermission } from "../../domain/errors/not-permission";
import {
  TransactionFactory,
  UserFactory,
  WalletFactory,
} from "../../infra/factories";
import { TestFactory } from "../../infra/factories/test-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters";

const deleteAccount = UserFactory.deleteAccountUser();
const createTransaction = TransactionFactory.create();
const bankRepository = TestFactory.bankRepository();
const retrieveWalletTransactionHistory =
  WalletFactory.retrieveTransactionHistory();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;
const date = new Date();
let wallet: Wallet;
let bankCode: string;

beforeAll(async () => {
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;

  wallet = await TestFactory.createWallet(user.id, user.workspaces[0]!.id);
  bankCode = wallet.bank.code;

  await createTransaction.execute({
    amount: 1,
    categorySequence: "",
    costCenterId: "",
    description: "any",
    dueDate: date,
    type: "CREDIT",
    userId: user.id,
    workspaceId: user.workspaces?.[0]!.id,
    defaultInstallmentWalletId: wallet.id,
    defaultInstallmentDueDate: date,
    paided: true,
  });
});

afterAll(async () => {
  await deleteAccount.execute(user?.id);
  await bankRepository.delete(bankCode);
  await deleteAccount.execute(userInvalid?.id);
});

test("wallet not found", () => {
  expect(
    async () =>
      await retrieveWalletTransactionHistory.execute({
        walletId: "any",
        userId: userInvalid.id,
        from: new Date(),
        to: new Date(),
      }),
  ).rejects.toThrowError(new EntityNotFound("wallet"));
});

test("user not permission", () => {
  expect(
    async () =>
      await retrieveWalletTransactionHistory.execute({
        walletId: wallet.id,
        userId: userInvalid.id,
        from: new Date(),
        to: new Date(),
      }),
  ).rejects.toThrowError(new NotPermission());
});
test("retrive history", async () => {
  const result = await retrieveWalletTransactionHistory.execute({
    walletId: wallet.id,
    userId: user.id,
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });

  expect(result.transactions.length).toBeGreaterThan(0);
  expect(result.balance).toBe(1);
  expect(result.bankFlag).includes("http");
  expect(result.surname).includes("any");
  expect(result.type).toBe("Outros");
});
