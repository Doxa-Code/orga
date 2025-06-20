import type { Bank } from "../../domain/entities/bank";
import type { Wallet } from "../../domain/entities/wallet";
import { EntityNotFound } from "../../domain/errors/entity-not-found";

interface WalletRepository {
  retrieve(id: string): Promise<Wallet | null>;
  update(wallet: Wallet): Promise<void>;
}

interface BankRepository {
  retrieveByCode(code: string): Promise<Bank | null>;
}

interface VerifyPermissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

export class EditWallet {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly bankRepository: BankRepository,
    private readonly verifyPermissionService: VerifyPermissionService,
  ) {}
  async execute(input: EditWalletInputDTO) {
    const wallet = await this.walletRepository.retrieve(input.walletId);

    if (!wallet) {
      throw new EntityNotFound("Wallet");
    }

    await this.verifyPermissionService.execute(
      input.userId,
      wallet.workspaceId,
    );

    if (input.bankCode) {
      const bank = await this.bankRepository.retrieveByCode(input.bankCode);

      if (!bank) {
        throw new EntityNotFound("Bank");
      }

      wallet.update({
        bank,
      });
    }

    wallet.update({
      agency: input.agency,
      name: input.name,
      number: input.number,
      type: input.type,
    });

    await this.walletRepository.update(wallet);
  }
}

export type EditWalletInputDTO = {
  userId: string;
  walletId: string;
  bankCode?: string;
  name?: string;
  type?: string;
  number?: string;
  agency?: string;
};
