import type { PartnerRaw } from "../application/mappers/partner-mapper";

export class ListPartnerLikeOptionPresentation {
  static create(partners: PartnerRaw[]) {
    return partners.map((partner) => ({
      partnerId: partner.id,
      name: partner.name,
    }));
  }
}
