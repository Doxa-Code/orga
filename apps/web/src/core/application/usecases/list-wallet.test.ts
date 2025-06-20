import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import { WalletFactory } from "../../infra/factories/wallet-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const listWallets = WalletFactory.list();
const deleteAccount = UserFactory.deleteAccountUser();
const createWallet = WalletFactory.create();
const bankRepository = TestFactory.bankRepository();

let user: RetrieveUserPresentationOutputDTO;
let bankCode: string;

beforeAll(async () => {
  bankCode = await TestFactory.createBank();

  user = await TestFactory.createUser();

  await createWallet.execute({
    balance: 1,
    bankCode,
    name: "any",
    type: "OTHERS",
    userId: user.id,
    workspaceId: user.workspaces[0]?.id!,
  });
});

afterAll(async () => {
  await bankRepository.delete(bankCode);
  await deleteAccount.execute(user?.id);
});

test("list wallet", async () => {
  const wallets = await listWallets.execute(user.id);

  expect(wallets.length).toBe(2);
});
