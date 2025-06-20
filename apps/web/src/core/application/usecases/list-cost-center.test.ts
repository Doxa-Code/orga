import { NotPermission } from "../../domain/errors/not-permission";
import { CostCenterFactory } from "../../infra/factories/cost-center-factory";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const listCostCenter = CostCenterFactory.list();
const createCostCenter = CostCenterFactory.create();
const deleteAccount = UserFactory.deleteAccountUser();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;

beforeAll(async () => {
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;

  await createCostCenter.execute({
    name: "any",
    userId: user.id,
    workspaceId: user?.workspaces?.[0]?.id,
  });
});

afterAll(async () => {
  await deleteAccount.execute(user?.id);
  await deleteAccount.execute(userInvalid?.id);
});

test("user not permission", async () => {
  expect(
    async () =>
      await listCostCenter.execute(
        user.workspaces.map((wk) => wk.id),
        userInvalid.id,
      ),
  ).rejects.toThrowError(new NotPermission());
});
