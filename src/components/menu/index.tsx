"use client";

import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "../common/typograph";
import { NavUser } from "../nav-user";
import { Button } from "../ui/button";
import { Sidebar } from "./sidebar";

interface MenuProps {
  children: ReactNode;
  user: {
    avatar: string;
    name: string;
    email: string;
  };
}

export function Menu(props: MenuProps) {
  return (
    <main className="overflow-hidden flex-1 w-full h-screen flex flex-col p-0">
      <header className="w-full h-screen max-h-[60px] bg-white z-50 flex px-4  items-center justify-center shadow">
        <div className="flex">
          <Logo className="text-2xl !font-semibold text-primary">Orga</Logo>
          <Logo className="text-2xl !font-semibold text-secondary">Saas</Logo>
        </div>
        <div className="w-full gap-2 flex justify-end items-center">
          <Button variant="ghost" className="rounded-md hover:bg-white/10 h-10">
            <Search className="stroke-white/90 size-[1.2rem]" />
          </Button>
          <Button variant="ghost" className="rounded-md hover:bg-white/10 h-10">
            <Bell className="stroke-white/90 size-[1.2rem]" />
          </Button>
          <NavUser user={props.user} />
        </div>
      </header>

      <section className="flex flex-1">
        <Sidebar />
        <main className="px-4 pt-6 flex-1 flex flex-col bg-[#F0F2F7] overflow-hidden w-full">
          {props.children}
        </main>
      </section>
    </main>
  );
}
