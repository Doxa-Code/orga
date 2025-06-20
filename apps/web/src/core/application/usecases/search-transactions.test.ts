import { endOfDay, startOfDay } from "date-fns";
import type { Wallet } from "../../domain/entities/wallet";
import { TestFactory } from "../../infra/factories/test-factory";
import { TransactionFactory } from "../../infra/factories/transaction-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import { GetResumeFromTransactionsPresentation } from "../../presenters";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const searchTransactions = TransactionFactory.searchTransactions();
const deleteAccount = UserFactory.deleteAccountUser();
const createTransaction = TransactionFactory.create();
const bankRepository = TestFactory.bankRepository();

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
  });
});

afterAll(async () => {
  await deleteAccount.execute(user?.id);
  await bankRepository.delete(bankCode);
  await deleteAccount.execute(userInvalid?.id);
});

test("search transactions", async () => {
  const transactions = await searchTransactions.execute({
    from: startOfDay(date).toISOString(),
    to: endOfDay(date).toISOString(),
    userId: user.id,
  });
  expect(transactions.length).toBeGreaterThanOrEqual(1);
  expect(transactions[0]!.category).toBe("0.0 - Outros");

  const result = GetResumeFromTransactionsPresentation.create(transactions);

  expect(transactions.length).toBeGreaterThanOrEqual(1);
  expect(transactions[0]!.category).toBe("0.0 - Outros");
  expect(result.credit).toBe(1);
  expect(result.debit).toBe(0);
  expect(result.total).toBe(1);
  expect(transactions[0]!).toHaveProperty("partnerName");
});
