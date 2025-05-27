import mailhog from "mailhog";
import { RedisCacheDriver } from "../../infra/drivers/cache-driver";
import { MongodbDatabaseConnection } from "../../infra/drivers/database-connection";
import { MailHugMailDriver } from "../../infra/drivers/mail-driver";
import { JWTTokenCreatorDriver } from "../../infra/drivers/token-authenticate-creator";
import { TestFactory } from "../../infra/factories/test-factory";
import { UserFactory } from "../../infra/factories/user-factory";
import type { RetrieveUserPresentationOutputDTO } from "../../presenters/retrieve-user-presentation";
import { UserRepositoryDatabase } from "../repositories/user-repository";
import { CreateCodeService } from "../services/create-code-service";
import { SendMailService } from "../services/send-mail-service";
import type { Payload } from "./authenticate-user";
import { CreateCodeToAuthenticate } from "./create-code-to-auth";

const deleteAccountUser = UserFactory.deleteAccountUser();
const sessionDatabaseDriver = new RedisCacheDriver();
const createCodeToAuthenticate = new CreateCodeToAuthenticate(
  new UserRepositoryDatabase(),
  new SendMailService(new MailHugMailDriver()),
  new CreateCodeService(sessionDatabaseDriver)
);
const authenticateUser = UserFactory.authenticateUser();

let user: RetrieveUserPresentationOutputDTO;

afterAll(async () => {
  await mailhog().deleteAll();
  await deleteAccountUser.execute(user?.id);
});

test("authenticate user", async () => {
  user = await TestFactory.createUser();

  expect(user.workspaces.length).toBe(1);

  await createCodeToAuthenticate.execute(user.email);

  expect(await sessionDatabaseDriver.retrieve(user.email)).toBeDefined();

  const message = await mailhog().latestTo(user.email);

  expect(message?.to).toBe(user.email);

  const regexCode = /\d{6}</gim;
  const code = message?.html?.match(regexCode)?.[0].replace("<", "") || "";

  const result = await authenticateUser.execute(user.email, code, "IP");
  const tokenCreatorDriver = new JWTTokenCreatorDriver<Payload>();

  const payload = tokenCreatorDriver.decoder(result.token);

  expect(result.token).toBeDefined();
  expect(result.payload.user).toBeDefined();
  expect(result.payload.workspaces.length).toBeGreaterThan(0);
  expect(payload?.ip).toBe("IP");
  expect(payload?.userId).toBe(user.id);
});
