import type { Readable } from "node:stream";
import { Bank } from "../../domain/entities/bank";

interface BankRepository {
  retrieveByCode(code: string): Promise<Bank | null>;
  create(bank: Bank): Promise<void>;
}
interface ImageStorageService {
  upload(key: string, buffer: Readable): Promise<void>;
}

export class CreateBank {
  constructor(
    private readonly bankRepository: BankRepository,
    private readonly imageStorage: ImageStorageService,
  ) {}

  async execute(data: InputDTO): Promise<Bank> {
    const bank = Bank.create(data.name, data.thumbnail, data.color, data.code);

    const alreadyExistsBank = await this.bankRepository.retrieveByCode(
      bank.code,
    );

    if (alreadyExistsBank) {
      return alreadyExistsBank;
    }

    await this.bankRepository.create(bank);

    if (data.thumbnailBuffer) {
      await this.imageStorage.upload(bank.thumbnail, data.thumbnailBuffer);
    }

    return bank;
  }
}

type InputDTO = {
  name: string;
  thumbnail?: string;
  thumbnailBuffer?: Readable;
  color: string;
  code?: string;
};
