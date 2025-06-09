import { PrismaClient } from "@/generated/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createServerActionProcedure } from "zsa";

export const securityProcedure = createServerActionProcedure()
  .handler(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/");
    const prisma = new PrismaClient();
    let workspace = await prisma.workspace.findFirst({
      where: {
        memberships: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: "Personal",
          memberships: {
            create: {
              userId: user.id,
              isOwner: true,
            },
          },
        },
      });
    }

    return {
      user,
      workspace,
    };
  })
  .createServerAction();
