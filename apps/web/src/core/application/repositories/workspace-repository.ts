import { Address } from "@/core/domain/valueobjects/address";
import { Email } from "@/core/domain/valueobjects/email";
import { prisma } from "@/lib/prisma";
import { Workspace } from "../../domain/entities/workspace";
import { Phone } from "../../domain/valueobjects/phone";
import { TaxId } from "../../domain/valueobjects/taxid";

export interface WorkspaceRepository {
  create(workspace: Workspace): Promise<void>;
  delete(workspaceId: string): Promise<void>;
  retrieve(workspaceId: string): Promise<Workspace | null>;
}

export class WorkspaceRepositoryDatabase implements WorkspaceRepository {
  private readonly databaseConnection = prisma;

  async retrieve(workspaceId: string): Promise<Workspace | null> {
    const result = await this.databaseConnection.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        address: true,
      },
    });
    if (!result) {
      return null;
    }
    return Workspace.instance({
      address: Address.create(result.address),
      cnpj: TaxId.create(result.cnpj),
      email: Email.create(result.email),
      id: result.id,
      name: result.name ?? "",
      phone: Phone.create(result.phone),
    });
  }

  async delete(workspaceId: string): Promise<void> {
    await this.databaseConnection.workspace.delete({
      where: { id: workspaceId },
      include: {
        accountPlans: true,
        costCenters: true,
        partners: true,
        transactions: true,
        address: true,
        memberships: true,
        wallets: {
          include: {
            transactions: true,
          },
        },
      },
    });
  }

  async create(workspace: Workspace): Promise<void> {
    await this.databaseConnection.workspace.create({
      data: {
        cnpj: workspace.cnpj.value,
        email: workspace.email.value,
        address: {
          create: workspace.address,
        },
        id: workspace.id,
        name: workspace.name,
        phone: workspace.phone.value,
      },
    });
  }
}
