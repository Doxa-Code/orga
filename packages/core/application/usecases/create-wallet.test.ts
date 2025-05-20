import { NotPermission } from "../../domain/errors/not-permission";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import { WalletFactory } from "../../infra/factories/wallet-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const deleteAccountUser = UserFactory.deleteAccountUser();
const walletRepository = TestFactory.walletRepository();
const bankRepository = TestFactory.bankRepository();
const createWallet = WalletFactory.create();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;
let bankCode: string;

beforeAll(async () => {
  bankCode = await TestFactory.createBank();
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;
});

afterAll(async () => {});

afterAll(async () => {
  await bankRepository.delete(bankCode);
  await deleteAccountUser.execute(user?.id);
  await deleteAccountUser.execute(userInvalid?.id);
});

test("user invalid", () => {
  expect(
    async () =>
      await createWallet.execute({
        bankCode,
        name: "Conta Legal",
        workspaceId: user?.workspaces?.[0]?.id!,
        userId: userInvalid?.id,
        type: "CHECKING_ACCOUNT",
        balance: 2000,
      }),
  ).rejects.toThrowError(new NotPermission());
  expect(
    async () =>
      await createWallet.execute({
        bankCode,
        name: "Conta Legal",
        workspaceId: user?.workspaces?.[0]?.id!,
        type: "CHECKING_ACCOUNT",
        balance: 2000,
        userId: "INVALID",
      }),
  ).rejects.toThrowError(new NotPermission());
});

test("create wallet", async () => {
  await createWallet.execute({
    bankCode,
    name: "Conta Legal",
    workspaceId: user?.workspaces?.[0]?.id!,
    userId: user?.id,
    type: "CHECKING_ACCOUNT",
    balance: 2000,
  });

  const [, wallet] = await walletRepository.list(
    user?.workspaces.map((wk) => wk.id),
  );

  expect(wallet?.name).toBe("Conta Legal");
});
