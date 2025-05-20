import { PrismaClient } from "@prisma/client";
import type { Partner } from "../../domain/entities/partner";
import { PartnerMapper, type PartnerRaw } from "../mappers/partner-mapper";

interface PartnerRepository {
  save(partner: Partner): Promise<void>;
  deleteByWorkspaceId(workspaceId: string): Promise<void>;
  retrieveByTaxId(taxId: string): Promise<PartnerRaw | null>;
  list(workspaceId: string, partnerRole: Partner.Role[]): Promise<PartnerRaw[]>;
  retrieve(id: string): Promise<PartnerRaw | null>;
}

export class PartnerRepositoryDatabase implements PartnerRepository {
  private readonly databaseConnection = new PrismaClient().partner;

  async retrieve(id: string): Promise<PartnerRaw | null> {
    const partner = await this.databaseConnection.findUnique({ where: { id } });

    if (!partner) {
      return null;
    }

    return partner;
  }

  async list(
    workspaceId: string,
    partnerRole: Partner.Role[],
  ): Promise<PartnerRaw[]> {
    const partners = await this.databaseConnection.findMany({
      where: {
        workspaceId,
        roles: { hasEvery: partnerRole },
      },
    });
    return partners;
  }

  async retrieveByTaxId(taxId: string): Promise<PartnerRaw | null> {
    const result = await this.databaseConnection.findFirst({
      where: { taxId },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<void> {
    await this.databaseConnection.deleteMany({ where: { workspaceId } });
  }

  async save(partner: Partner): Promise<void> {
    await this.databaseConnection.create({
      data: PartnerMapper.toPersist(partner),
    });
  }
}
