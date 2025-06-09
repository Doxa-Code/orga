import { NotPermission } from "../../domain/errors/not-permission";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import { WalletFactory } from "../../infra/factories/wallet-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";
import type { WalletRaw } from "../mappers/wallet-mapper";

const deleteAccountUser = UserFactory.deleteAccountUser();
const walletRepository = TestFactory.walletRepository();
const bankRepository = TestFactory.bankRepository();

const createWallet = WalletFactory.create();
const deleteWallet = WalletFactory.delete();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;
let wallet: WalletRaw;
let bankCode: string;

beforeAll(async () => {
  bankCode = await TestFactory.createBank();
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;

  await createWallet.execute({
    bankCode,
    name: "Conta Legal",
    workspaceId: user?.workspaces?.[0]?.id,
    userId: user?.id,
    type: "CHECKING_ACCOUNT",
    balance: 2000,
  });

  const [walletCreated] = await walletRepository.list(
    user.workspaces.map((wk) => wk.id),
  );
  wallet = walletCreated;
});

afterAll(async () => {
  await bankRepository.delete(bankCode);
  await deleteAccountUser.execute(user?.id);
  await deleteAccountUser.execute(userInvalid?.id);
});

test("user not permission", () => {
  expect(
    async () =>
      await deleteWallet.execute({
        userId: userInvalid.id,
        walletId: wallet.id,
      }),
  ).rejects.toThrowError(new NotPermission());
});

test("Delete wallet", async () => {
  await deleteWallet.execute({
    userId: user?.id,
    walletId: wallet?.id,
  });
  const wallets = await walletRepository.list(
    user.workspaces.map((wk) => wk.id),
  );
  expect(wallets.length).toBe(1);
});
