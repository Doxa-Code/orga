import { UserFactory } from "@/core/infra/factories/user-factory";
import {
  AbilityBuilder,
  type CreateAbility,
  type MongoAbility,
  createMongoAbility,
} from "@casl/ability";
import { z } from "zod";
import { walletSubject } from "./subjects";

const appAbilitiesSchema = z.union([
  walletSubject,
  z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;
type AppAbility = MongoAbility<AppAbilities>;
const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export const getUserPermissions = async (userId: string) => {
  const user = await UserFactory.retrieveUser().execute(userId);

  const { can, build } = new AbilityBuilder(createAppAbility);

  can("create", "wallet", {
    workspaceId: { $in: user.membership.map((ms) => ms.workspaceId) },
  });

  const ability = build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  return ability;
};
