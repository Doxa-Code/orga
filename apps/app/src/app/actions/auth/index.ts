"use server";

import { PAYLOAD_KEY_TOKEN } from "@/constants";
import { JWTTokenCreatorDriver } from "@orga/core/drivers";
import { UserFactory } from "@orgafactories";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerAction } from "zsa";
import {
  authenticateUserInputSchema,
  createCodeInputSchema,
  getPayloadOutputSchema,
} from "./schema";

export const createCodeToAuthenticate = createServerAction()
  .input(createCodeInputSchema)
  .handler(async ({ input }) => {
    const createCodeToAuthenticate = UserFactory.createCodeToAuthenticate();
    await createCodeToAuthenticate.execute(input.email);
  });

export const authenticateWithCode = createServerAction()
  .input(authenticateUserInputSchema)
  .handler(async ({ input }) => {
    const authenticateWithCode = UserFactory.authenticateUser();
    const payload = await authenticateWithCode.execute(
      input.email,
      input.code,
      input.ip,
    );
    cookies().set(PAYLOAD_KEY_TOKEN, JSON.stringify(payload));
    redirect("/dashboard");
  });

export const getPayload = createServerAction()
  .output(getPayloadOutputSchema)
  .handler(async () => {
    return JSON.parse(cookies().get(PAYLOAD_KEY_TOKEN)?.value || "{}");
  });

export const checkAuthenticateAction = createServerAction().handler(
  async () => {
    if (!cookies().has(PAYLOAD_KEY_TOKEN)) {
      return redirect("/signin");
    }

    const [payload] = await getPayload();

    const tokenAuthenticateCreator = new JWTTokenCreatorDriver();
    const tokenIsValid = tokenAuthenticateCreator.verify(payload?.token);

    if (!tokenIsValid) {
      return redirect("/signin");
    }

    return redirect("/dashboard");
  },
);

export const logoutAction = createServerAction().handler(async () => {
  redirect("/signin");
});
