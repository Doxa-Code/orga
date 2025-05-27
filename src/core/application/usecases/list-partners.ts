import type { Partner, Transaction } from "../../domain";
import { FieldMissing } from "../../domain/errors/field-missing";
import type { PartnerRaw } from "../mappers/partner-mapper";

interface PartnerRepository {
  list(workspaceId: string, partnerRole: Partner.Role[]): Promise<PartnerRaw[]>;
}

export class ListPartners {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async execute(
    workspaceId: string,
    type?: Transaction.Type,
  ): Promise<PartnerRaw[]> {
    if (!workspaceId) {
      throw new FieldMissing("workspace ID");
    }

    const partnerRoles: Partner.Role[] =
      type === "CREDIT"
        ? ["CUSTOMER"]
        : type === "DEBIT"
          ? ["SUPPLIER"]
          : ["CUSTOMER", "SUPPLIER"];

    return await this.partnerRepository.list(workspaceId, partnerRoles);
  }
}
