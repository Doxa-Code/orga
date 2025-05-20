import { EntityNotFound } from "../../domain/errors/entity-not-found";
import type { WalletRaw } from "../mappers/wallet-mapper";

interface WalletRepository {
  retrieve(id: string): Promise<WalletRaw | null>;
  delete(id: string): Promise<void>;
}

interface VerifyPemissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

export class DeleteWallet {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly verifyPermissionService: VerifyPemissionService,
  ) {}
  async execute(input: InputDTO) {
    const wallet = await this.walletRepository.retrieve(input.walletId);
    if (!wallet) {
      throw new EntityNotFound("Wallet");
    }

    await this.verifyPermissionService.execute(
      input.userId,
      wallet.workspaceId,
    );

    await this.walletRepository.delete(input.walletId);
  }
}

export type InputDTO = {
  userId: string;
  walletId: string;
};
