import { FieldMissing } from "../../domain/errors/field-missing";
import { PartnerFactory } from "../../infra/factories/partner-factory";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const deleteAccount = UserFactory.deleteAccountUser();
const createPartner = PartnerFactory.create();
const listPartners = PartnerFactory.list();

let user: RetrieveUserPresentationOutputDTO;

beforeAll(async () => {
  user = await TestFactory.createUser();
  await createPartner.execute({
    name: "Fernando",
    roles: ["CUSTOMER"],
    type: "COMPANY",
    workspaceId: user.workspaces[0]!.id,
  });
});

afterAll(async () => {
  await deleteAccount.execute(user?.id);
});

test("not workspace id informated", () => {
  expect(
    async () => await listPartners.execute("", "CREDIT"),
  ).rejects.toThrowError(new FieldMissing("workspace ID"));
});

test("list partners", async () => {
  let partners = await listPartners.execute(user.workspaces[0]!.id, "CREDIT");
  expect(partners.length).toBeGreaterThan(0);
  expect(partners[0]).not.toHaveProperty("_id");
  partners = await listPartners.execute(user.workspaces[0]!.id, "DEBIT");
  expect(partners.length).toBe(0);
});
