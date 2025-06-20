import type { Transaction } from "../../domain/entities/transaction";
import { NotPermission } from "../../domain/errors/not-permission";
import { TestFactory } from "../../infra/factories/test-factory";
import { TransactionFactory } from "../../infra/factories/transaction-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";

const deleteAccount = UserFactory.deleteAccountUser();
const makePaymentOnTransaction = TransactionFactory.makePaymentOnTransaction();
const transactionRepository = TestFactory.transactionRepository();

let user: RetrieveUserPresentationOutputDTO;
let userInvalid: RetrieveUserPresentationOutputDTO;
let transaction: Transaction;
let walletId: string;

beforeAll(async () => {
  user = await TestFactory.createUser();
  userInvalid = await TestFactory.createUserInvalid();
  const wallet = await TestFactory.createWallet(
    user.id,
    user.workspaces[0]!.id,
  );
  walletId = wallet.id;
  transaction = await TestFactory.createTransaction(
    user.id,
    wallet.id,
    user.workspaces[0]!.id,
  );
});

afterAll(async () => {
  await deleteAccount.execute(user.id);
  await deleteAccount.execute(userInvalid.id);
});

test("user not permission", () => {
  expect(
    async () =>
      await makePaymentOnTransaction.execute({
        transactionId: transaction.id,
        paymentId: transaction.payments[0]!.id,
        userId: userInvalid.id,
        amountPaided: 2,
        paymentDate: new Date(),
        paymentMethod: "OTHERS",
        walletId,
      }),
  ).rejects.toThrowError(new NotPermission());
});

test("make payment", async () => {
  await makePaymentOnTransaction.execute({
    transactionId: transaction.id,
    paymentId: transaction.payments[0]!.id,
    userId: user.id,
    amountPaided: 10,
    paymentDate: new Date(),
    paymentMethod: "OTHERS",
    walletId,
  });

  const transactionUpdated = await transactionRepository.retrieve(
    transaction.id,
  );

  expect(transactionUpdated?.status).toBe("PAID");
});
