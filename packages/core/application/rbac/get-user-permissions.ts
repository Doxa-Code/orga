import {
  AbilityBuilder,
  type CreateAbility,
  type InferSubjects,
  type MongoAbility,
  createMongoAbility,
} from "@casl/ability";
import { z } from "zod";
import { UserFactory } from "../../infra/factories";
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
