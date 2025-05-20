import type { Wallet } from "../../domain";
import type { WalletTransaction } from "../../domain/valueobjects/wallet-transaction";
import type { WalletRaw } from "../mappers/wallet-mapper";
import type { WorkspaceRaw } from "../mappers/workspace-mapper";

interface WalletsRepository {
  list(workspacesId: string[]): Promise<WalletRaw[]>;
}

interface ImageStorage {
  assigneeImage(key: string): Promise<string>;
}

interface WorkspaceRepository {
  retrieveByOwner(ownerId: string): Promise<WorkspaceRaw[]>;
}

export class ListWallets {
  constructor(
    private readonly walletsRepository: WalletsRepository,
    private readonly imageStorage: ImageStorage,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async execute(userId: string): Promise<ListWalletsOutputDTO[]> {
    const workspaces = await this.workspaceRepository.retrieveByOwner(userId);
    const wallets = await this.walletsRepository.list(
      workspaces.map((wk) => wk.id),
    );

    return await Promise.all(
      wallets.map(async (wallet) => ({
        ...wallet,
        bank: {
          ...wallet.bank,
          thumbnail: await this.imageStorage.assigneeImage(
            wallet.bank.thumbnail,
          ),
        },
      })),
    );
  }
}

export type ListWalletsOutputDTO = {
  bank: {
    thumbnail: string;
    code: string;
    name: string;
  };
  id: string;
  name: string;
  balance: number;
  type: Wallet.Type;
  number: string;
  agency: string;
  workspaceId: string;
  transactions: WalletTransaction[];
};
