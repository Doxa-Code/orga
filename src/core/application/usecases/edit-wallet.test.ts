import { NotPermission } from "../../domain/errors/not-permission";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import { WalletFactory } from "../../infra/factories/wallet-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const deleteAccountUser = UserFactory.deleteAccountUser();
const walletRepository = TestFactory.walletRepository();
const bankRepository = TestFactory.bankRepository();
const createWallet = WalletFactory.create();
const editWallet = WalletFactory.edit();

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

test("user invalid", () => {
  expect(
    async () =>
      await editWallet.execute({
        walletId,
        userId: "any",
        name: "Outro name",
      }),
  ).rejects.toThrowError(new NotPermission());
  expect(
    async () =>
      await editWallet.execute({
        walletId,
        userId: userInvalid.id,
        name: "Outro name",
      }),
  ).rejects.toThrowError(new NotPermission());
});

test("Edit wallet", async () => {
  await editWallet.execute({
    walletId,
    userId: user.id,
    name: "Outro name",
  });
  const wallet = await walletRepository.retrieve(walletId);
  const wallets = await walletRepository.list(
    user.workspaces.map((wk) => wk.id),
  );

  expect(wallet?.name).toBe("Outro name");
  expect(wallets.length).toBe(2);
});
