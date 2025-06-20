import type { Wallet } from "../../domain/entities/wallet";
import { EntityNotFound } from "../../domain/errors/entity-not-found";

interface WalletRepository {
  retrieve(id: string): Promise<Wallet | null>;
}

interface VerifyPermissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

export class RetrieveWallet {
  constructor(
    private readonly walletsRepository: WalletRepository,
    private readonly verifyPermissionService: VerifyPermissionService,
  ) {}

  async execute(walletId: string, userId: string) {
    const wallet = await this.walletsRepository.retrieve(walletId);

    if (!wallet) {
      throw new EntityNotFound("wallet");
    }

    await this.verifyPermissionService.execute(userId, wallet.workspaceId);

    return wallet;
  }
}
