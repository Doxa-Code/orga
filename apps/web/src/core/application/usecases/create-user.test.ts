import { FieldAlreadyExists } from "../../domain/errors/field-already-exists";
import { FieldMissing } from "../../domain/errors/field-missing";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import { WalletFactory } from "../../infra/factories/wallet-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const createUser = UserFactory.createUser();
const deleteAccount = UserFactory.deleteAccountUser();
const listWallet = WalletFactory.list();

let user: RetrieveUserPresentationOutputDTO;

beforeAll(async () => {
  user = await TestFactory.createUser();
});

afterAll(async () => {
  await deleteAccount.execute(user.id);
});

test("email missing", () => {
  expect(
    async () =>
      await createUser.execute({
        email: "",
        name: "any",
      }),
  ).rejects.toThrowError(new FieldMissing("email"));
});

test("email already exists", async () => {
  expect(
    async () =>
      await createUser.execute({
        email: user.email,
        name: "any",
      }),
  ).rejects.toThrowError(new FieldAlreadyExists(`Email ${user.email}`));
});

test("create user", async () => {
  const user = await createUser.execute({
    email: "any@any.com.br",
    name: "any",
  });

  expect(user.id).toBeTruthy();
  expect(user.active).toBe(true);
  expect(user.email.value).toBe("any@any.com.br");

  const wallets = await listWallet.execute(user.id);

  expect(wallets.length).toBe(1);

  await deleteAccount.execute(user.id);
});
