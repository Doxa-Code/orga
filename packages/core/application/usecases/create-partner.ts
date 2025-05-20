import { Partner } from "../../domain/entities/partner";
import { FieldAlreadyExists } from "../../domain/errors/field-already-exists";
import type { PartnerRaw } from "../mappers/partner-mapper";

interface PartnerRepository {
  save(partner: Partner): Promise<void>;
  retrieveByTaxId(taxId: string): Promise<PartnerRaw | null>;
}

export class CreatePartner {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async execute(input: CreatePartnerInputDTO) {
    const partnerAlreadyExists = input.taxId
      ? await this.partnerRepository.retrieveByTaxId(input.taxId!)
      : false;

    if (partnerAlreadyExists) {
      throw new FieldAlreadyExists("partner");
    }

    const partner = Partner.create({
      name: input.name,
      roles: input.roles as Partner.Role[],
      type: input.type as Partner.Type,
      workspaceId: input.workspaceId,
      address: input.address,
      email: input.email,
      phone: input.phone,
      taxId: input.taxId,
    });

    await this.partnerRepository.save(partner);

    return partner;
  }
}

export interface CreatePartnerInputDTO {
  type: string;
  roles: string[];
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    neighborhood?: string;
    number?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    note?: string;
  };
  workspaceId: string;
}
