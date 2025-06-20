import { PartnerFactory } from "../infra/factories/partner-factory";
import { TestFactory } from "../infra/factories/test-factory";
import { UserFactory } from "../infra/factories/user-factory";
import { ListPartnerLikeOptionPresentation } from "./list-partner-like-option-presentation";
import type { RetrieveUserPresentationOutputDTO } from "./retrieve-user-presentation";

const deleteAccount = UserFactory.deleteAccountUser();
const createPartner = PartnerFactory.create();
const listPartner = PartnerFactory.list();

let user: RetrieveUserPresentationOutputDTO;

beforeAll(async () => {
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;

  await createPartner.execute({
    name: "Fernando",
    roles: ["CUSTOMER"],
    type: "COMPANY",
    workspaceId: user.workspaces[0]!.id,
  });
});

afterAll(async () => {
  await deleteAccount.execute(user.id);
});

test("list partners", async () => {
  const partners = await listPartner.execute(user.workspaces[0]!.id);
  const results = ListPartnerLikeOptionPresentation.create(partners);
  expect(Object.keys(results[0]!)).toHaveLength(2);
  expect(results[0]!.name).toBe("Fernando");
});
