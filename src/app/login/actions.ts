"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import z from "zod";
import { createServerAction } from "zsa";

export const login = createServerAction()
  .input(
    z.object({
      email: z.string(),
      password: z.string(),
    }),
    {
      type: "formData",
    }
  )
  .handler(async ({ input }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (error) {
      throw new Error(error.message);
    }
    redirect("/");
  });
