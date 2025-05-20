import { UserFactory } from "@orga/core/factories";
import { redirect } from "next/navigation";
import { createServerActionProcedure } from "zsa";
import { getPayload } from "./auth";

export const securityProcedure = createServerActionProcedure()
  .handler(async () => {
    try {
      const [payload] = await getPayload();

      if (!payload) {
        throw new Error();
      }

      const retrieveUser = UserFactory.retrieveUser();

      await retrieveUser.execute(payload.payload.user.id);

      return payload;
    } catch (err) {
      const error = new Error("User not authenticated");
      error.name = "401";
      throw error;
    }
  })
  .createServerAction()
  .onError((err) => {
    if (err instanceof Error) {
      if (err.name === "401") {
        redirect("/?action=logout");
      }
      return;
    }
  });
