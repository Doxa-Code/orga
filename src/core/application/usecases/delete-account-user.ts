import { Workspace } from "@/core/domain/entities/workspace";
import type { User } from "../../domain/entities/user";

interface WorkspaceRepository {
  retrieveByOwner(ownerId: string): Promise<Workspace[]>;
}

interface UserRepository {
  retrieve(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

interface DeleteWorkspace {
  execute(workspaceId: string): Promise<void>;
}

export class DeleteAccountUser {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UserRepository,
    private readonly deleteWorkspace: DeleteWorkspace
  ) {}

  async execute(userId: string) {
    if (!userId) {
      return;
    }

    const user = await this.userRepository.retrieve(userId);

    if (!user) {
      return;
    }

    const workspaces = await this.workspaceRepository.retrieveByOwner(user.id);

    await Promise.all(
      workspaces.map(async (workspace) => {
        await this.deleteWorkspace.execute(workspace.id);
      })
    );

    await this.userRepository.delete(user.id);
  }
}
