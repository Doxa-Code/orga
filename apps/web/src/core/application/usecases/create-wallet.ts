import { Workspace } from "@/core/domain/entities/workspace";
import type { Bank } from "../../domain/entities/bank";
import { Wallet } from "../../domain/entities/wallet";
import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { NotPermission } from "../../domain/errors/not-permission";
import { getUserPermissions } from "../rbac/get-user-permissions";
import { walletPermissionSchema } from "../rbac/subjects";

interface WalletRepository {
  save(wallet: Wallet): Promise<void>;
}

interface BankRepository {
  retrieveByCode(code: string): Promise<Bank | null>;
}

interface WorkpaceRepository {
  retrieve(userId: string): Promise<Workspace | null>;
}
export class CreateWallet {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly bankRepository: BankRepository,
    private readonly workspaceRepository: WorkpaceRepository
  ) {}
  async execute(input: CreateWalletInputDTO) {
    const permissions = await getUserPermissions(input.userId);

    if (permissions.cannot("create", walletPermissionSchema.parse(input))) {
      throw new NotPermission();
    }

    const workspace = await this.workspaceRepository.retrieve(
      input.workspaceId
    );

    if (!workspace) {
      throw new EntityNotFound("workspace");
    }

    const bank = await this.bankRepository.retrieveByCode(input.bankCode);

    if (!bank) {
      throw new EntityNotFound(`Bank ${input.bankCode}`);
    }

    const wallet = Wallet.create({
      bank,
      name: input.name,
      workspaceId: workspace.id,
      agency: input.agency,
      balance: input.balance,
      number: input.number,
      type: input.type,
    });

    await this.walletRepository.save(wallet);

    return wallet;
  }
}

export type CreateWalletInputDTO = {
  bankCode: string;
  name: string;
  workspaceId: string;
  type: Wallet.Type;
  balance: number;
  userId: string;
  agency?: string;
  number?: string;
};
