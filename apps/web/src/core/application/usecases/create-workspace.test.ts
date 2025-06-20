import type { User } from "../../domain/entities/user";
import { FieldMissing } from "../../domain/errors/field-missing";
import { UserFactory } from "../../infra/factories/user-factory";
import { WorkspaceFactory } from "../../infra/factories/workspace-factory";

const createUser = UserFactory.createUser();
const deleteAccount = UserFactory.deleteAccountUser();
const createWorkspace = WorkspaceFactory.create();

let user: User;

beforeAll(async () => {
  user = await createUser.execute({
    email: "any2@any.com.br",
    name: "any",
  });
});

afterAll(async () => {
  await deleteAccount.execute(user?.id);
});

test("owner not found", () => {
  expect(
    async () => await createWorkspace.execute("any", ""),
  ).rejects.toThrowError(new FieldMissing("Owner"));
});

test("name not sent", () => {
  expect(
    async () => await createWorkspace.execute("", user.id),
  ).rejects.toThrowError(new FieldMissing("Name"));
});

test("create workspace", async () => {
  const workspace = await createWorkspace.execute("any", user.id);
  expect(workspace.name).toBe("any");
});
