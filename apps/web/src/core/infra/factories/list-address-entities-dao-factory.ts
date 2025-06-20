import { ListAddressEntitiesDAO } from "../../application/DAO/list-address-entities-dao";
import { BrasilApiLoadExternalDataDriver } from "../drivers/load-external-data-driver";

export class ListAddressEntitiesDAOFactory {
  static create() {
    return new ListAddressEntitiesDAO(new BrasilApiLoadExternalDataDriver());
  }
}
