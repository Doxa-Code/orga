import fs from "node:fs";
import path from "node:path";
import { BankRepositoryDatabase } from "../../application/repositories/bank-repository";
import { TransactionRepositoryDatabase } from "../../application/repositories/transaction-repository";
import { UserRepositoryDatabase } from "../../application/repositories/user-repository";
import { WalletRepositoryDatabase } from "../../application/repositories/wallet-repository";
import { Email } from "../../domain/valueobjects/email";
import { BankFactory } from "./bank-factory";
import { TransactionFactory } from "./transaction-factory";
import { UserFactory } from "./user-factory";
import { WalletFactory } from "./wallet-factory";

const createUser = UserFactory.createUser();
const retrieveUser = UserFactory.retrieveUser();
const deleteAccount = UserFactory.deleteAccountUser();
const userRepository = new UserRepositoryDatabase();

const createWallet = WalletFactory.create();
const createBank = BankFactory.create();
const createTransaction = TransactionFactory.create();
let bankCode: string;

export class TestFactory {
  static async createTransaction(
    userId: string,
    walletId: string,
    workspaceId: string,
    paided?: boolean,
    type?: "CREDIT" | "DEBIT",
  ) {
    return await createTransaction.execute({
      description: "any description",
      workspaceId: workspaceId,
      amount: 10,
      type: type || "DEBIT",
      categorySequence: "5.1",
      dueDate: new Date(),
      userId: userId,
      defaultInstallmentWalletId: walletId,
      defaultInstallmentDueDate: new Date(),
      paided: !!paided,
    });
  }

  static bankRepository() {
    return new BankRepositoryDatabase();
  }

  static transactionRepository() {
    return new TransactionRepositoryDatabase();
  }

  static walletRepository() {
    return new WalletRepositoryDatabase();
  }

  static async createWallet(userId: string, workspaceId: string) {
    bankCode = await TestFactory.createBank();
    return createWallet.execute({
      balance: 0,
      bankCode,
      name: "any",
      type: "OTHERS",
      userId,
      workspaceId,
    });
  }

  static async createBank() {
    const code = `001${crypto.randomUUID().toString()}`;
    await createBank.execute({
      name: "Banco do Brasil S.A.",
      code,
      thumbnail: "banks/bb.webp",
      color: "#FAEA00",
    });

    return code;
  }

  static async createBankorga() {
    const exists = await this.bankRepository().retrieveByCode("000");

    if (exists) {
      return;
    }

    const code = "000";
    await createBank.execute({
      code,
      name: "Orga Saas",
      thumbnail: "banks/orga.webp",
      color: "#FFFFFF",
      thumbnailBuffer: fs.createReadStream(
        path.resolve(__dirname, "../../../resources/orga.webp"),
      ),
    });
  }

  static async createUser() {
    const userEmail = `any${crypto.randomUUID().toString()}@any.com.br`;
    const alreadyExistsUser = await userRepository.retrieveByEmail(
      Email.create(userEmail),
    );

    if (alreadyExistsUser) {
      await deleteAccount.execute(alreadyExistsUser.id);
    }

    const { id } = await createUser.execute({
      email: userEmail,
      name: "any",
    });

    const user = await retrieveUser.execute(id);

    return user;
  }

  static async createUserInvalid() {
    const userInvalidEmail = `invalid${crypto
      .randomUUID()
      .toString()}@invalid.com.br`;

    const alreadyExistsUserInvalid = await userRepository.retrieveByEmail(
      Email.create(userInvalidEmail),
    );

    if (alreadyExistsUserInvalid) {
      await deleteAccount.execute(alreadyExistsUserInvalid.id);
    }

    const { id: userInvalidId } = await createUser.execute({
      email: userInvalidEmail,
      name: "invalid",
    });

    const userInvalid = await retrieveUser.execute(userInvalidId);
    return userInvalid;
  }

  static async createUserAndUserInvalid() {
    await this.createBankorga();
    const [user, userInvalid] = await Promise.all([
      this.createUser(),
      this.createUserInvalid(),
    ]);

    return { user, userInvalid };
  }
}
