import type { Wallet } from "../../domain/entities/wallet";
import type { Workspace } from "../../domain/entities/workspace";
import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { FieldInvalid } from "../../domain/errors/field-invalid";
import { FieldMissing } from "../../domain/errors/field-missing";
import { NotPermission } from "../../domain/errors/not-permission";
import { CostCenterFactory } from "../../infra/factories/cost-center-factory";
import { TestFactory } from "../../infra/factories/test-factory";
import { TransactionFactory } from "../../infra/factories/transaction-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import { WorkspaceFactory } from "../../infra/factories/workspace-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";
import type { ListCostCenterOutputDTO } from "./list-cost-center";

const deleteAccount = UserFactory.deleteAccountUser();
const createWorkspace = WorkspaceFactory.create();
const createCostCenter = CostCenterFactory.create();
const listCostCenter = CostCenterFactory.list();
const createTransaction = TransactionFactory.create();
const bankRepository = TestFactory.bankRepository();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;
let workspace: Workspace;
let costCenter: ListCostCenterOutputDTO;
let wallet: Wallet;
let bankCode: string;

beforeAll(async () => {
  const results = await TestFactory.createUserAndUserInvalid();
  user = results.user;
  userInvalid = results.userInvalid;

  workspace = await createWorkspace.execute("any", user.id);

  wallet = await TestFactory.createWallet(user.id, workspace.id);

  bankCode = wallet.bank.code;

  await createCostCenter.execute({
    name: "any",
    workspaceId: workspace.id,
    userId: user.id,
  });

  const list = await listCostCenter.execute([workspace.id], user.id);
  costCenter = list[0]!;
});

afterAll(async () => {
  await deleteAccount.execute(user.id);
  await deleteAccount.execute(userInvalid.id);
  await bankRepository.delete(bankCode);
});

test("not workspace informated", async () => {
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: "",
        amount: 10,
        type: "DEBIT",
        costCenterId: costCenter.id,
        categorySequence: "5.1",
        dueDate: new Date(),
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new FieldMissing("workspace ID"));
});

test("workspace not found", async () => {
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: "1",
        amount: 10,
        type: "DEBIT",
        costCenterId: costCenter.id,
        categorySequence: "5.1",
        dueDate: new Date(),
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new EntityNotFound("workspace"));
});

test("not type informated", async () => {
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: workspace.id,
        amount: 10,
        type: "",
        costCenterId: costCenter.id,
        categorySequence: "5.1",
        dueDate: new Date(),
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new FieldMissing("type"));
});

test("type invalid", async () => {
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: workspace.id,
        amount: 10,
        type: "INVALID",
        costCenterId: costCenter.id,
        categorySequence: "5.1",
        dueDate: new Date(),
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new FieldInvalid("type"));
});

test("category invalid", async () => {
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: workspace.id,
        amount: 10,
        type: "DEBIT",
        costCenterId: costCenter.id,
        categorySequence: "INVALID",
        dueDate: new Date(),
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new FieldInvalid("category"));
});

test("category not found", async () => {
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: workspace.id,
        amount: 10,
        type: "DEBIT",
        costCenterId: costCenter.id,
        categorySequence: "1231231.1231231231231231",
        dueDate: new Date(),
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new EntityNotFound("category"));
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: workspace.id,
        amount: 10,
        type: "DEBIT",
        costCenterId: costCenter.id,
        categorySequence: "5.1231231231231231",
        dueDate: new Date(),
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new EntityNotFound("category"));
});

test("cost center not found", async () => {
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: workspace.id,
        amount: 10,
        type: "DEBIT",
        costCenterId: "any",
        categorySequence: "5.1",
        dueDate: new Date(),
        userId: user.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new EntityNotFound("cost center"));
});

test("invalid user", async () => {
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: workspace.id,
        amount: 10,
        type: "DEBIT",
        costCenterId: costCenter.id,
        categorySequence: "5.1",
        dueDate: new Date(),
        userId: userInvalid.id,
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new NotPermission());
  expect(
    async () =>
      await createTransaction.execute({
        description: "any description",
        workspaceId: workspace.id,
        amount: 10,
        type: "DEBIT",
        costCenterId: costCenter.id,
        categorySequence: "5.1",
        dueDate: new Date(),
        userId: "any",
        defaultInstallmentDueDate: new Date(),
        defaultInstallmentWalletId: wallet.id,
      }),
  ).rejects.toThrowError(new NotPermission());
});

test("create transaction", async () => {
  const transaction = await createTransaction.execute({
    description: "any description",
    workspaceId: workspace.id,
    amount: 10,
    type: "DEBIT",
    costCenterId: costCenter.id,
    categorySequence: "5.1",
    dueDate: new Date(),
    userId: user.id,
    defaultInstallmentDueDate: new Date(),
    defaultInstallmentWalletId: wallet.id,
  });

  expect(transaction.description).toBe("any description");
  expect(transaction.amount).toBe(10);
  expect(transaction.amountPaided).toBe(0);
});
