import { FieldAlreadyExists } from "../../domain/errors/field-already-exists";
import { FieldInvalid } from "../../domain/errors/field-invalid";
import { FieldMissing } from "../../domain/errors/field-missing";
import { PartnerFactory } from "../../infra/factories/partner-factory";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const deleteAccount = UserFactory.deleteAccountUser();
const createPartner = PartnerFactory.create();

let user: RetrieveUserPresentationOutputDTO;

beforeAll(async () => {
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
});

afterAll(async () => {
  await deleteAccount.execute(user.id);
});

test("not workspace informated", async () => {
  expect(
    async () =>
      await createPartner.execute({
        type: "company",
        roles: ["customer"],
        name: "DIRECAO GERAL",
        taxId: "00.000.000/0001-91",
        email: "SECEX@BB.COM.BR",
        phone: "61 3493-9002",
        address: {
          street: "SAUN QUADRA 5 BLOCO B TORRE I, II, III",
          number: "SN",
          neighborhood: "ASA NORTE",
          city: "Brasilia",
          state: "DF",
          zipCode: "70040912",
          country: "Brasil",
          note: "ANDAR T I SL S101 A S1602 T II SL C101 A C1602 TIII SL N101 A N1602",
        },
        workspaceId: "",
      }),
  ).rejects.toThrowError(new FieldMissing("workspace ID"));
});

test("not type informated", async () => {
  expect(
    async () =>
      await createPartner.execute({
        type: "",
        roles: ["customer"],
        name: "DIRECAO GERAL",
        taxId: "00.000.000/0001-91",
        email: "SECEX@BB.COM.BR",
        phone: "61 3493-9002",
        address: {
          street: "SAUN QUADRA 5 BLOCO B TORRE I, II, III",
          number: "SN",
          neighborhood: "ASA NORTE",
          city: "Brasilia",
          state: "DF",
          zipCode: "70040912",
          country: "Brasil",
          note: "ANDAR T I SL S101 A S1602 T II SL C101 A C1602 TIII SL N101 A N1602",
        },
        workspaceId: "any",
      }),
  ).rejects.toThrowError(new FieldMissing("type"));
});

test("type invalid", async () => {
  expect(
    async () =>
      await createPartner.execute({
        type: "any type",
        roles: ["customer"],
        name: "DIRECAO GERAL",
        taxId: "00.000.000/0001-91",
        email: "SECEX@BB.COM.BR",
        phone: "61 3493-9002",
        address: {
          street: "SAUN QUADRA 5 BLOCO B TORRE I, II, III",
          number: "SN",
          neighborhood: "ASA NORTE",
          city: "Brasilia",
          state: "DF",
          zipCode: "70040912",
          country: "Brasil",
          note: "ANDAR T I SL S101 A S1602 T II SL C101 A C1602 TIII SL N101 A N1602",
        },
        workspaceId: "any",
      }),
  ).rejects.toThrowError(new FieldInvalid("type"));
});

test("not roles informated", async () => {
  expect(
    async () =>
      await createPartner.execute({
        type: "company",
        roles: [""],
        name: "DIRECAO GERAL",
        taxId: "00.000.000/0001-91",
        email: "SECEX@BB.COM.BR",
        phone: "61 3493-9002",
        address: {
          street: "SAUN QUADRA 5 BLOCO B TORRE I, II, III",
          number: "SN",
          neighborhood: "ASA NORTE",
          city: "Brasilia",
          state: "DF",
          zipCode: "70040912",
          country: "Brasil",
          note: "ANDAR T I SL S101 A S1602 T II SL C101 A C1602 TIII SL N101 A N1602",
        },
        workspaceId: "any",
      }),
  ).rejects.toThrowError(new FieldMissing("roles"));
  expect(
    async () =>
      await createPartner.execute({
        type: "company",
        roles: ["any"],
        name: "DIRECAO GERAL",
        taxId: "00.000.000/0001-91",
        email: "SECEX@BB.COM.BR",
        phone: "61 3493-9002",
        address: {
          street: "SAUN QUADRA 5 BLOCO B TORRE I, II, III",
          number: "SN",
          neighborhood: "ASA NORTE",
          city: "Brasilia",
          state: "DF",
          zipCode: "70040912",
          country: "Brasil",
          note: "ANDAR T I SL S101 A S1602 T II SL C101 A C1602 TIII SL N101 A N1602",
        },
        workspaceId: "any",
      }),
  ).rejects.toThrowError(new FieldMissing("roles"));
});

test("create transaction", async () => {
  const partner = await createPartner.execute({
    type: "company",
    roles: ["customer"],
    name: "DIRECAO GERAL",
    taxId: "00.000.000/0001-91",
    email: "SECEX@BB.COM.BR",
    phone: "61 3493-9002",
    address: {
      street: "SAUN QUADRA 5 BLOCO B TORRE I, II, III",
      number: "SN",
      neighborhood: "ASA NORTE",
      city: "Brasilia",
      state: "DF",
      zipCode: "70040912",
      country: "Brasil",
      note: "ANDAR T I SL S101 A S1602 T II SL C101 A C1602 TIII SL N101 A N1602",
    },
    workspaceId: user.workspaces[0]?.id!,
  });

  expect(partner.name).toBe("DIRECAO GERAL");
  expect(partner.id).toBeDefined();

  expect(
    async () =>
      await createPartner.execute({
        type: "company",
        roles: ["customer"],
        name: "DIRECAO GERAL",
        taxId: "00.000.000/0001-91",
        email: "SECEX@BB.COM.BR",
        phone: "61 3493-9002",
        address: {
          street: "SAUN QUADRA 5 BLOCO B TORRE I, II, III",
          number: "SN",
          neighborhood: "ASA NORTE",
          city: "Brasilia",
          state: "DF",
          zipCode: "70040912",
          country: "Brasil",
          note: "ANDAR T I SL S101 A S1602 T II SL C101 A C1602 TIII SL N101 A N1602",
        },
        workspaceId: user.workspaces[0]?.id!,
      }),
  ).rejects.toThrowError(new FieldAlreadyExists("partner"));
});
