import { CostCenterFactory } from "../../infra/factories/cost-center-factory";
import { FinanceFactory } from "../../infra/factories/finance-factory";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const listFinanceEntities = FinanceFactory.listEntities();
const createCostCenter = CostCenterFactory.create();
const deleteAccount = UserFactory.deleteAccountUser();

let user: RetrieveUserPresentationOutputDTO;

beforeAll(async () => {
  user = await TestFactory.createUser();

  await createCostCenter.execute({
    name: "any",
    userId: user.id,
    workspaceId: user?.workspaces?.[0]?.id!,
  });
});

afterAll(async () => {
  await deleteAccount.execute(user?.id);
});

test("list finance entities", async () => {
  const result = await listFinanceEntities.execute(user.id);
  expect(result).toHaveProperty("costCenters");
  expect(result).toHaveProperty("categories");
});
