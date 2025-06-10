import { Membership } from "../../domain/entities/membership";
import { User } from "../../domain/entities/user";
import type { Workspace } from "../../domain/entities/workspace";
import { FieldAlreadyExists } from "../../domain/errors/field-already-exists";
import type { Email } from "../../domain/valueobjects/email";
import type { CreateWalletInputDTO } from "./create-wallet";

export type CreateUserInputDTO = {
  name: string;
  email: string;
};

interface UserRepository {
  save(user: User): Promise<void>;
  retrieveByEmail(email: Email): Promise<User | null>;
}

interface CreateWorkspace {
  execute(name: string): Promise<Workspace>;
}

interface PopulateAccountPlanService {
  execute(workspaceId: string): Promise<void>;
}

interface CreateWallet {
  execute(input: CreateWalletInputDTO): Promise<any>;
}

export class CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createWorkspace: CreateWorkspace,
    private readonly populateAccountPlanService: PopulateAccountPlanService,
    private readonly createWallet: CreateWallet
  ) {}

  async execute(input: CreateUserInputDTO) {
    const user = User.create(input.name, input.email);

    const emailAlreadyExists = await this.userRepository.retrieveByEmail(
      user.email
    );

    if (emailAlreadyExists) {
      throw new FieldAlreadyExists(`Email ${user.email.value}`);
    }

    const workspace = await this.createWorkspace.execute("Personal");

    const membership = Membership.create(user.id, workspace.id, true);

    user.turnMember(membership);

    await this.userRepository.save(user);

    await this.populateAccountPlanService.execute(workspace.id);

    await this.createWallet.execute({
      balance: 0,
      bankCode: "000",
      name: "Conta Orga Saas",
      type: "CHECKING_ACCOUNT",
      userId: user.id,
      workspaceId: workspace.id,
    });

    return user;
  }
}
