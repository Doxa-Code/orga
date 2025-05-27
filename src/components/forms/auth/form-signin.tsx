"use client";

import {
  authenticateWithCode,
  createCodeToAuthenticate,
} from "@/app/actions/auth";
import { useServerActionMutation } from "@/app/actions/query-key-factory";
import { AlertError } from "@/components/alerts/common/alert-error";
import { FormDefault } from "@/components/forms/common/form-default";
import { OTPInputForm } from "@/components/inputs/common/otp-input-form";
import { TextInputForm } from "@/components/inputs/common/text-input.form";
import { useFormSchema } from "@/hooks/use-form-schema";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Button } from "@orga/ui/button";
import { SymbolIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import useCountDown from "react-countdown-hook";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido!" }),
  code: z.string().max(6),
});

export function FormSignIn() {
  const ref = useRef<HTMLInputElement>(null);
  const createCodeToAuthenticateAction = useServerActionMutation(
    createCodeToAuthenticate,
    {
      mutationKey: ["create-code-to-authenticate"],
      onSuccess() {
        setCodeCreated(true);
        start();
        setTimeout(() => {
          ref.current?.focus();
        }, 100);
      },
    },
  );
  const authenticateWithCodeAction = useServerActionMutation(
    authenticateWithCode,
    {
      mutationKey: ["authenticate-with-code"],
    },
  );
  const [codeCreated, setCodeCreated] = useState(false);
  const [timeLeft, { start, reset }] = useCountDown(60000, 1000);
  const isPending =
    createCodeToAuthenticateAction.status === "pending" ||
    authenticateWithCodeAction.status === "pending";

  const form = useFormSchema({
    schema: formSchema,
    defaultValues: {
      email: "",
      code: "",
    },
  });

  useEffect(() => {
    if (timeLeft === 0) {
      reset();
      setCodeCreated(false);
      form.reset();
    }
  }, [timeLeft]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, code } = values;
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    if (code) {
      return authenticateWithCodeAction.mutate({
        email,
        code,
        ip: result.visitorId,
      });
    }

    createCodeToAuthenticateAction.mutate({ email });
  }

  return (
    <>
      <FormDefault
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 overflow-hidden max-w-[500px]"
      >
        <AlertError message={createCodeToAuthenticateAction?.error?.message} />
        <TextInputForm name="email" hidden={codeCreated} label="Email" />
        <OTPInputForm
          hidden={!codeCreated}
          name="code"
          ref={ref}
          slots={6}
          label="Código de autenticação"
          description={
            <>
              O código enviado no email informado!{" "}
              <span className="text-primary">
                Reenviar código em {timeLeft / 1000}s
              </span>
            </>
          }
        />
        <Button
          disabled={isPending}
          type="submit"
          className="group flex w-full gap-2 bg-primary hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SymbolIcon
            width={20}
            className="hidden animate-spin group-disabled:block"
          />
          <span>Continuar</span>
        </Button>
      </FormDefault>
    </>
  );
}
