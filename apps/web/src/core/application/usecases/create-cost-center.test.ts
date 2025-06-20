import type { Workspace } from "../../domain/entities/workspace";
import { FieldInvalid } from "../../domain/errors/field-invalid";
import { FieldMissing } from "../../domain/errors/field-missing";
import { NotPermission } from "../../domain/errors/not-permission";
import { CostCenterFactory } from "../../infra/factories/cost-center-factory";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import { WorkspaceFactory } from "../../infra/factories/workspace-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const createCostCenter = CostCenterFactory.create();
const listCostCenter = CostCenterFactory.list();
const createWorkspace = WorkspaceFactory.create();
const deleteAccount = UserFactory.deleteAccountUser();

let workspace: Workspace;
let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;

beforeAll(async () => {
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;
  workspace = await createWorkspace.execute("any", user.id);
});

afterAll(async () => {
  await deleteAccount.execute(user.id);
  await deleteAccount.execute(userInvalid.id);
});

test("workspace id not informated", async () => {
  expect(
    async () =>
      await createCostCenter.execute({
        code: "1",
        name: "any",
        workspaceId: "",
        userId: user.id,
      }),
  ).rejects.toThrowError(new FieldMissing("workspace ID"));
});

test("workspace not exists", async () => {
  expect(
    async () =>
      await createCostCenter.execute({
        code: "1",
        name: "any",
        workspaceId: "1",
        userId: user.id,
      }),
  ).rejects.toThrowError(new FieldInvalid("workspace ID"));
});

test("user invalid", async () => {
  expect(
    async () =>
      await createCostCenter.execute({
        code: "1",
        name: "any",
        workspaceId: workspace.id,
        userId: userInvalid.id,
      }),
  ).rejects.toThrowError(new NotPermission());
  expect(
    async () =>
      await createCostCenter.execute({
        code: "1",
        name: "any",
        workspaceId: workspace.id,
        userId: "ANYWHERE",
      }),
  ).rejects.toThrowError(new NotPermission());
});

test("create cost center", async () => {
  await createCostCenter.execute({
    code: "1",
    name: "any",
    workspaceId: workspace.id,
    userId: user.id,
  });

  const [costCenter] = await listCostCenter.execute([workspace.id], user.id);

  expect(costCenter?.workspace?.id).toBe(workspace.id);
});
