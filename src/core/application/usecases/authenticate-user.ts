import { AuthenticateInvalid } from "../../domain/errors/authenticate-invalid";
import { Email } from "../../domain/valueobjects/email";
import type { UserRaw } from "../mappers/user-mapper";
import type { WorkspaceRaw } from "../mappers/workspace-mapper";

export type Payload = {
  ip: string;
  userId: string;
};

interface UserRepository {
  retrieveByEmail(email: Email): Promise<UserRaw | null>;
}

interface CacheDriver {
  retrieve(key: string): Promise<string>;
  delete(key: string): Promise<void>;
}

interface TokenCreatorDriver {
  create(payload: Payload): string;
}

interface WorkspaceRepository {
  retrieveByOwner(ownerId: string): Promise<WorkspaceRaw[]>;
}

export class AuthenticateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheDriver: CacheDriver,
    private readonly tokenCreatorDriver: TokenCreatorDriver,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async execute(
    email: string,
    code: string,
    ip: string,
  ): Promise<AuthenticateUserOutputDTO> {
    const user = await this.userRepository.retrieveByEmail(Email.create(email));

    if (!user) {
      throw new AuthenticateInvalid();
    }

    const codeRegistered = await this.cacheDriver.retrieve(email);

    if (!codeRegistered || codeRegistered !== code) {
      throw new AuthenticateInvalid();
    }

    await this.cacheDriver.delete(email);

    const token = this.tokenCreatorDriver.create({ userId: user.id, ip });

    const workspaces = await this.workspaceRepository.retrieveByOwner(user.id);

    return {
      token,
      payload: {
        user,
        workspaces,
      },
    };
  }
}

export type AuthenticateUserOutputDTO = {
  token: string;
  payload: {
    user: UserRaw;
    workspaces: WorkspaceRaw[];
  };
};
