import { Logo } from "@/components/common/typograph";
import { FormSignIn } from "@/components/forms/auth/form-signin";
import { AspectRatio } from "@orga/ui/aspect-ratio";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login | Budget",
};

export default function Signin() {
  return (
    <main className="h-screen w-full bg-[#F6F9FC] lg:flex">
      <section className="flex w-full items-center justify-center py-24">
        <div className="mx-auto grid w-full max-w-[500px] gap-6">
          <header className="flex">
            <Logo className="text-primary">Budget</Logo>
            <Logo className="text-secondary">Saas</Logo>
          </header>
          <FormSignIn />
          <div className="flex w-full items-center justify-start gap-1 text-sm">
            <span className="font-light">Não tem conta ainda?</span>
            <Link
              className="text-primary hover:text-secondary hover:underline"
              href="https://orga.com.br"
            >
              Inscreva-se aqui
            </Link>
          </div>
        </div>
      </section>
      <div className="w-[80%]">
        <AspectRatio
          ratio={14 / 20}
          className="hidden bg-primary justify-end lg:flex"
        >
          <Image
            alt="public"
            src="/login.webp"
            fill
            className="h-full w-full object-contain"
          />
        </AspectRatio>
      </div>
    </main>
  );
}
