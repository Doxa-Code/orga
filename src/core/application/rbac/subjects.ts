import { z } from "zod";

export const walletPermissionSchema = z.object({
  workspaceId: z.string(),
  __typename: z.literal("wallet").default("wallet"),
});

export const walletSubject = z.tuple([
  z.literal("create"),
  z.union([z.literal("wallet"), walletPermissionSchema]),
]);
