import { FieldMissing } from "../../domain/errors/field-missing";
import { NotPermission } from "../../domain/errors/not-permission";

interface WorkspaceRepository {
  retrieveByOwner(ownerId: string): Promise<any[]>;
}

export class VerifyPermissionService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}
  async execute(userId: string, workspaceId: string): Promise<void> {
    if (!workspaceId) {
      throw new FieldMissing("Workspace Id");
    }

    if (!userId) {
      throw new FieldMissing("User Id");
    }

    const workspaces = await this.workspaceRepository.retrieveByOwner(userId);

    if (workspaces.length <= 0) {
      throw new NotPermission();
    }

    if (!workspaces.map((wk) => wk.id).includes(workspaceId)) {
      throw new NotPermission();
    }
  }
}
