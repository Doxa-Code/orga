import fs from "node:fs";
import path from "node:path";
import { BankFactory } from "../../infra/factories/bank-factory";
import { TestFactory } from "../../infra/factories/test-factory";

const bankRepository = TestFactory.bankRepository();

afterAll(async () => {
  await bankRepository.delete("001ssss");
});

test("create bank", async () => {
  const listBank = BankFactory.list();
  const createBank = BankFactory.create();

  await createBank.execute({
    name: "Banco do Brasil S.A.",
    code: "001ssss",
    thumbnail: "banks/bb.webp",
    color: "#FAEA00",
    thumbnailBuffer: fs.createReadStream(
      path.resolve(__dirname, "../../resources/bb.webp"),
    ),
  });

  const banks = await listBank.execute();

  expect(banks[0]?.thumbnail).includes("http");
});
