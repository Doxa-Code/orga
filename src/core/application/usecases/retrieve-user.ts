import type { User } from "../../domain/entities/user";
import { EntityNotFound } from "../../domain/errors/entity-not-found";

interface UserRepository {
  retrieve(id: string): Promise<User | null>;
}

export class RetrieveUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.retrieve(userId);

    if (!user) {
      throw new EntityNotFound("user");
    }

    return user;
  }
}
