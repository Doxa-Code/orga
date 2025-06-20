import type { Bank } from "../../domain/entities/bank";

interface BankRepository {
  list(): Promise<Bank[]>;
}

interface ImageStorage {
  assigneeImage(key: string): Promise<string>;
}

export class ListBank {
  constructor(
    private readonly bankRepository: BankRepository,
    private readonly imageStorage: ImageStorage,
  ) {}

  async execute() {
    const banks = await this.bankRepository.list();
    return await Promise.all(
      banks.map(async (bank) => ({
        ...bank,
        thumbnail: await this.imageStorage.assigneeImage(bank.thumbnail),
      })),
    );
  }
}
