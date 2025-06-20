import { PrismaClient } from "@prisma/client";
import { getUserPermissions } from "./get-user-permissions";
import { walletPermissionSchema } from "./subjects";

const databaseConnection = new PrismaClient();

const membershipId = crypto.randomUUID().toString();
const workspaceId = crypto.randomUUID().toString();

afterAll(async () => {
  await databaseConnection.membership.delete({
    where: { id: membershipId },
    include: {
      user: true,
      workspace: {
        include: {
          wallet: {
            include: {
              transactions: true,
            },
          },
        },
      },
    },
  });
});

test("create wallet", async () => {
  const user = await databaseConnection.user.create({
    data: {
      email: "any@any.com.br",
      id: crypto.randomUUID().toString(),
      plan: "TRIAL",
      name: "ANY",
      membership: {
        create: {
          id: membershipId,
          isOwner: true,
          workspace: {
            create: {
              id: workspaceId,
            },
          },
        },
      },
    },
  });

  const permissions = await getUserPermissions(user.id);

  expect(
    permissions.can("create", walletPermissionSchema.parse({ workspaceId })),
  ).toBe(true);
});
