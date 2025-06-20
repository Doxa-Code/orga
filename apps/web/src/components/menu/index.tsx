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
    <main className="overflow-hidden flex-1 w-full flex-col h-screen flex p-0">
      <header className="w-full h-screen bg-primary max-h-[60px] z-50 flex px-4  items-center justify-center shadow">
        <div className="flex px-4">
          <Logo className="text-2xl !font-bold text-white">Orga</Logo>
          <Logo className="text-2xl !font-bold text-white">Saas</Logo>
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

      <section className="flex-1 flex bg-background shadow overflow-hidden w-full">
        <Sidebar />
        <div className="w-full flex-1 overflow-hidden flex">
          {props.children}
        </div>
      </section>
    </main>
  );
}
