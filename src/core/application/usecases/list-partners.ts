import { Partner } from "@/core/domain/entities/partner";
import { FieldMissing } from "../../domain/errors/field-missing";
import { Transaction } from "@/core/domain/entities/transaction";

interface PartnerRepository {
  list(workspaceId: string, partnerRole: Partner.Role[]): Promise<Partner[]>;
}

export class ListPartners {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async execute(
    workspaceId: string,
    type?: Transaction.Type
  ): Promise<Partner[]> {
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
