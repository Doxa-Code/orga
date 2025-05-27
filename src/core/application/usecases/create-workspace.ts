import { Workspace } from "../../domain/entities/workspace";
import { FieldMissing } from "../../domain/errors/field-missing";

interface WorkspacesRepository {
  create(workspace: Workspace): Promise<void>;
}

export class CreateWorkspace {
  constructor(private readonly workspaceRepository: WorkspacesRepository) {}

  async execute(name: string) {
    if (!name) {
      throw new FieldMissing("Name");
    }

    const workspace = Workspace.create(name);

    await this.workspaceRepository.create(workspace);

    return workspace;
  }
}
