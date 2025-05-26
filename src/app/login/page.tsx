import { Logo } from "@/components/typograph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Metadata } from "next";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Login | Orga",
};

export default function Signin() {
  return (
    <main className="h-screen flex justify-center items-center w-full bg-[#fefefe] lg:flex">
      <section className="mx-auto grid w-full max-w-[400px] gap-6">
        <header className="flex">
          <Logo className="text-primary">Orga</Logo>
          <Logo className="text-secondary">Saas</Logo>
        </header>
        <form
          action={async (form) => {
            "use server";
            await login(form);
          }}
          className="flex bg-white shadow border p-6 rounded-xl flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground font-light">Email</Label>
            <Input name="email" type="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground font-light">Senha</Label>
            <Input name="password" type="password" />
          </div>
          <Button>Acessar</Button>
        </form>
      </section>
    </main>
  );
}
