"use client";
import { Logo } from "@/components/common/typograph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useServerActionMutation } from "../actions/query-key-factory";
import { login } from "./actions";
import { Toast } from "@/components/toast";

export default function Signin() {
  const loginAction = useServerActionMutation(login, {
    onError(error) {
      if (error.message === "NEXT_REDIRECT") return;
      Toast.error("Erro ao acessar o sistema", error.message);
    },
  });
  return (
    <main className="h-screen flex justify-center items-center w-full bg-[#fefefe] lg:flex">
      <section className="mx-auto grid w-full max-w-[400px] gap-6">
        <header className="flex">
          <Logo className="text-primary">Orga</Logo>
          <Logo className="text-secondary">Saas</Logo>
        </header>
        <form
          className="flex bg-white rounded-xl flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            loginAction.mutate(formData);
          }}
        >
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground font-light">Email</Label>
            <Input name="email" type="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground font-light">Senha</Label>
            <Input name="password" type="password" />
          </div>
          <Button disabled={loginAction.isPending}>
            {loginAction.isPending ? (
              <>
                <Loader2 className="animate-spin" /> Acessando...
              </>
            ) : (
              "Acessar"
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}
