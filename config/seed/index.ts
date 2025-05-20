import fs from "node:fs";
import path from "node:path";
import type { CreateUserInputDTO } from "@orga/core/application";
import { UserRepositoryDatabase } from "@orgaapplication";
import { Email } from "@orgadomain";
import { BankFactory, UserFactory } from "@orgafactories";
import banks from "./data/banks";

const PAYLOAD: CreateUserInputDTO = {
  name: "User",
  email: "user@orgar",
};

const userRepository = new UserRepositoryDatabase();
const createUser = UserFactory.createUser();
const createBank = BankFactory.create();

(async () => {
  console.log("Semeando os dados iniciais");

  for (const bank of banks) {
    await createBank.execute({
      ...bank,
      thumbnailBuffer: fs.createReadStream(
        path.resolve(__dirname, `./data/${bank.thumbnail}`)
      ),
      thumbnail: bank.thumbnail,
    });
  }

  const user = await userRepository.retrieveByEmail(
    Email.create(PAYLOAD.email)
  );

  if (user) {
    console.log("===================================");
    console.log("User Exists");
    console.log("Email: ", PAYLOAD.email);
    console.log("===================================");
    process.exit(0);
  }

  await createUser.execute(PAYLOAD);

  console.log("===================================");
  console.log("User Created");
  console.log("Email: ", PAYLOAD.email);
  console.log("===================================");
  process.exit(0);
})();
