import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

let user: RetrieveUserPresentationOutputDTO;
const retrieveUser = UserFactory.retrieveUser();
const deleteAccountUser = UserFactory.deleteAccountUser();

beforeAll(async () => {
  user = await TestFactory.createUser();
});

afterAll(async () => {
  await deleteAccountUser.execute(user?.id);
});

test("user not found", () => {
  expect(
    async () => await retrieveUser.execute("any user id"),
  ).rejects.toThrowError(new EntityNotFound("user"));
});

test("retrieve user", async () => {
  const userRetrieved = await retrieveUser.execute(user?.id);
  expect(userRetrieved.name).toEqual(user.name);
});
