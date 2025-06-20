import { PartnerRepositoryDatabase } from "../../application/repositories/partner-repository";
import { CreatePartner } from "../../application/usecases/create-partner";
import { ListPartners } from "../../application/usecases/list-partners";

const partnersRepository = new PartnerRepositoryDatabase();

export class PartnerFactory {
  static create() {
    return new CreatePartner(partnersRepository);
  }

  static list() {
    return new ListPartners(partnersRepository);
  }
}
