import { prisma } from "@/lib/prisma";
import { Membership } from "../../domain/entities/membership";
import { User } from "../../domain/entities/user";
import { Email } from "../../domain/valueobjects/email";

export interface UserRepository {
  delete(userId: string): Promise<void>;
  save(user: User): Promise<void>;
  retrieveByEmail(email: Email): Promise<User | null>;
  retrieve(id: string): Promise<User | null>;
  update(user: User): Promise<void>;
}

export class UserRepositoryDatabase implements UserRepository {
  private readonly databaseConnection = prisma as any;

  async update(user: User) {
    await this.databaseConnection.user.update({
      where: {
        id: user.id,
      },
      data: {
        active: user.active,
        createdAt: user.createdAt,
        email: user.email.value,
        id: user.id,
        name: user.name,
        plan: user.plan,
        membership: {
          upsert: user.membership.map((ms) => ({
            create: {
              id: ms.id,
              isOwner: ms.isOwner,
              workspaceId: ms.workspaceId,
            },
            update: {
              isOwner: ms.isOwner,
              workspaceId: ms.workspaceId,
            },
            where: {
              id: ms.id,
            },
          })),
        },
      },
    });
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
    await this.databaseConnection.user.create({
      data: {
        active: user.active,
        createdAt: user.createdAt,
        email: user.email.value,
        id: user.id,
        name: user.name,
        plan: user.plan,
        membership: {
          connectOrCreate: user.membership.map((ms) => ({
            create: {
              id: ms.id,
              isOwner: ms.isOwner,
              workspaceId: ms.workspaceId,
            },
            where: {
              id: ms.id,
            },
          })),
        },
      },
    });
  }

  async retrieveByEmail(email: Email): Promise<User | null> {
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

    return User.instance({
      active: Boolean(user.active),
      createdAt: new Date(user.createdAt ?? new Date()),
      email: Email.create(user.email),
      id: user.id,
      membership: user.membership.map(Membership.instance),
      name: user.name,
      plan: user.plan as User.Plan,
    });
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

    return User.instance({
      active: Boolean(user.active),
      createdAt: new Date(user.createdAt ?? new Date()),
      email: Email.create(user.email),
      id: user.id,
      membership: user.membership.map(Membership.instance),
      name: user.name,
      plan: user.plan as User.Plan,
    });
  }
}
