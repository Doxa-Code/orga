import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { NotPermission } from "../../domain/errors/not-permission";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import { WalletFactory } from "../../infra/factories/wallet-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const deleteAccountUser = UserFactory.deleteAccountUser();
const bankRepository = TestFactory.bankRepository();
const createWallet = WalletFactory.create();
const retrieveWallet = WalletFactory.retrieve();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;
let walletId: string;
let bankCode: string;

beforeAll(async () => {
  bankCode = await TestFactory.createBank();
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;

  const wallet = await createWallet.execute({
    bankCode,
    name: "Conta Legal",
    workspaceId: user?.workspaces?.[0]?.id!,
    userId: user?.id,
    type: "CHECKING_ACCOUNT",
    balance: 2000,
  });

  walletId = wallet.id;
});

afterAll(async () => {
  await bankRepository.delete(bankCode);
  await deleteAccountUser.execute(user?.id);
  await deleteAccountUser.execute(userInvalid?.id);
});

test("wallet not found", async () => {
  expect(
    async () => await retrieveWallet.execute("anyid", user?.id),
  ).rejects.toThrowError(new EntityNotFound("wallet"));
});

test("user not permission", () => {
  expect(
    async () => await retrieveWallet.execute(walletId, userInvalid?.id),
  ).rejects.toThrowError(new NotPermission());
});

test("retrieve transaction", async () => {
  const transactionRetrieved = await retrieveWallet.execute(walletId, user?.id);
  expect(transactionRetrieved.id).toBe(walletId);
});
