interface WorkspacesRepository {
  delete(workspaceId: string): Promise<void>;
}

interface AccountPlanRepository {
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
}

interface WalletRepository {
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
}

interface CostCenterRepository {
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
}

interface TransactionRepository {
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
}

interface PartnerRepository {
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
}

export class DeleteWorkspace {
  constructor(
    private readonly workspaceRepository: WorkspacesRepository,
    private readonly accountPlanRepository: AccountPlanRepository,
    private readonly walletRepository: WalletRepository,
    private readonly costCenterRepository: CostCenterRepository,
    private readonly transactionsRepository: TransactionRepository,
    private readonly partnerRepository: PartnerRepository,
  ) {}

  async execute(workspaceId: string) {
    if (!workspaceId) {
      return;
    }

    await Promise.all([
      this.accountPlanRepository.deleteByWorkspaceId(workspaceId),
      this.walletRepository.deleteByWorkspaceId(workspaceId),
      this.costCenterRepository.deleteByWorkspaceId(workspaceId),
      this.workspaceRepository.delete(workspaceId),
      this.transactionsRepository.deleteByWorkspaceId(workspaceId),
      this.partnerRepository.deleteByWorkspaceId(workspaceId),
    ]);
  }
}
