import { Address } from "@/core/domain/valueobjects/address";
import { Email } from "@/core/domain/valueobjects/email";
import { PrismaClient } from "@/generated/prisma";
import { Partner } from "../../domain/entities/partner";
import { Phone } from "../../domain/valueobjects/phone";
import { TaxId } from "../../domain/valueobjects/taxid";

interface PartnerRepository {
  save(partner: Partner): Promise<void>;
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
  retrieveByTaxId(taxId: string): Promise<Partner | null>;
  list(workspaceId: string, partnerRole: Partner.Role[]): Promise<Partner[]>;
  retrieve(id: string): Promise<Partner | null>;
}

export class PartnerRepositoryDatabase implements PartnerRepository {
  private readonly databaseConnection = new PrismaClient();

  static instance() {
    return new PartnerRepositoryDatabase();
  }

  async retrieve(id: string): Promise<Partner | null> {
    const partner = await this.databaseConnection.partner.findUnique({
      where: { id },
      include: {
        address: true,
      },
    });

    if (!partner) {
      return null;
    }

    return Partner.instance({
      address: Address.create(partner.address),
      createdAt: partner.createdAt,
      email: Email.create(partner.email),
      id: partner.id,
      name: partner.name,
      phone: Phone.create(partner.phone),
      roles: partner.roles,
      status: partner.status,
      taxId: TaxId.create(partner.taxId),
      type: partner.type,
      workspaceId: partner.workspaceId,
    });
  }

  async list(
    workspaceId: string,
    partnerRole: Partner.Role[],
  ): Promise<Partner[]> {
    const partners = await this.databaseConnection.partner.findMany({
      where: {
        workspaceId,
        roles: { hasEvery: partnerRole },
      },
      include: {
        address: true,
      },
    });
    return partners.map((partner) =>
      Partner.instance({
        address: Address.create(partner.address),
        createdAt: partner.createdAt,
        email: Email.create(partner.email),
        id: partner.id,
        name: partner.name,
        phone: Phone.create(partner.phone),
        roles: partner.roles,
        status: partner.status,
        taxId: TaxId.create(partner.taxId),
        type: partner.type,
        workspaceId: partner.workspaceId,
      }),
    );
  }

  async retrieveByTaxId(taxId: string): Promise<Partner | null> {
    const partner = await this.databaseConnection.partner.findFirst({
      where: { taxId },
      include: {
        address: true,
      },
    });

    if (!partner) {
      return null;
    }

    return Partner.instance({
      address: Address.create(partner.address),
      createdAt: partner.createdAt,
      email: Email.create(partner.email),
      id: partner.id,
      name: partner.name,
      phone: Phone.create(partner.phone),
      roles: partner.roles,
      status: partner.status,
      taxId: TaxId.create(partner.taxId),
      type: partner.type,
      workspaceId: partner.workspaceId,
    });
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<void> {
    await this.databaseConnection.partner.deleteMany({
      where: { workspaceId },
    });
  }

  async save(partner: Partner): Promise<void> {
    await this.databaseConnection.partner.create({
      data: {
        createdAt: partner.createdAt,
        email: partner.email.value,
        name: partner.name,
        phone: partner.phone.value,
        status: partner.status,
        taxId: partner.taxId.value,
        type: partner.type,
        address: {
          create: partner.address,
        },
        id: partner.id,
        roles: partner.roles,
        workspace: {
          connect: {
            id: partner.workspaceId,
          },
        },
      },
    });
  }
}
