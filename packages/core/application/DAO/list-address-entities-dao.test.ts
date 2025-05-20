import { ListAddressEntitiesDAOFactory } from "../../infra/factories/list-address-entities-dao-factory";

const listAddressEntities = ListAddressEntitiesDAOFactory.create();

test("list states", async () => {
  const response = await listAddressEntities.listStates();

  expect(response.length).toBeGreaterThan(0);
});

test("retrieve city by state", async () => {
  const response = await listAddressEntities.retrieveCities("SP");

  expect(response.length).toBeGreaterThan(0);
});
