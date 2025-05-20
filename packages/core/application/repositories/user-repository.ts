import { PrismaClient } from "@prisma/client";
import type { User } from "../../domain/entities/user";
import type { Email } from "../../domain/valueobjects/email";
import { UserMapper, type UserRaw } from "../mappers/user-mapper";

export interface UserRepository {
  delete(userId: string): Promise<void>;
  save(user: User): Promise<void>;
  retrieveByEmail(email: Email): Promise<UserRaw | null>;
  retrieve(id: string): Promise<User | null>;
  update(user: User): Promise<void>;
}

export class UserRepositoryDatabase implements UserRepository {
  private readonly databaseConnection = new PrismaClient();

  async update(user: User) {
    const { membership, ...userData } = UserMapper.toPersist(user);

    await this.databaseConnection.$transaction([
      this.databaseConnection.user.update({
        where: {
          id: user.id,
        },
        data: userData,
      }),
      ...membership.map((ms) =>
        this.databaseConnection.membership.upsert({
          where: {
            id: ms.id,
          },
          create: ms,
          update: ms,
        }),
      ),
    ]);
  }

  async delete(userId: string): Promise<void> {
    if (!userId) {
      return;
    }

    await this.databaseConnection.user.delete({
      where: {
        id: userId,
      },
      include: {
        membership: {
          include: {
            workspace: {
              include: {
                accountPlan: true,
                costCenter: true,
                partner: true,
                transaction: true,
                wallet: {
                  include: {
                    transactions: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async save(user: User): Promise<void> {
    const { membership, ...userData } = UserMapper.toPersist(user);
    await this.databaseConnection.$transaction([
      this.databaseConnection.user.create({
        data: userData,
      }),
      this.databaseConnection.membership.createMany({
        data: membership,
      }),
    ]);
  }

  async retrieveByEmail(email: Email): Promise<UserRaw | null> {
    const user = await this.databaseConnection.user.findFirst({
      where: {
        email: email.value,
      },
      include: {
        membership: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async retrieve(id: string): Promise<User | null> {
    if (!id) {
      return null;
    }

    const user = await this.databaseConnection.user.findUnique({
      where: { id },
      include: {
        membership: true,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }
}
