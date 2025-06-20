import { Partner } from "../domain/entities/partner";

export class ListPartnerLikeOptionPresentation {
  static create(partners: Partner[]) {
    return partners.map((partner) => ({
      partnerId: partner.id,
      name: partner.name,
    }));
  }
}
