import { Membership } from "../../domain/entities/membership";
import { User } from "../../domain/entities/user";
import { Email } from "../../domain/valueobjects/email";

export interface UserRaw {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: Date;
  plan: User.Plan;
  membership: {
    id: string;
    isOwner: boolean;
    userId: string;
    workspaceId: string;
  }[];
}

export class UserMapper {
  static toPersist(input: User): UserRaw {
    return {
      active: input.active,
      createdAt: input.createdAt,
      email: input.email.value,
      id: input.id,
      name: input.name,
      plan: input.plan,
      membership: input.membership,
    };
  }

  static toDomain(input: UserRaw): User {
    return new User({
      active: input.active,
      createdAt: new Date(input.createdAt),
      email: new Email(input.email),
      id: input.id,
      name: input.name,
      plan: input.plan,
      membership: input.membership.map(
        (membership) => new Membership(membership),
      ),
    });
  }
}
