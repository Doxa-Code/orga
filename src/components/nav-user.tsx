"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const name = useMemo(() => user.name || "Usuário", [user.name]);
  const supabase = createClient();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded h-auto bg-transparent hover:bg-[#F1F4F9]/10 flex gap-4"
        >
          <Avatar className="h-7 w-7 bg-gray-200 rounded-full">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs">
              <User className="size-[16px]" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-4 items-start">
            <span className="text-[#F1F4F9]">{name}</span>
            <span className="text-[#F1F4F9] font-light">{user.email}</span>
          </div>
          <ChevronDown className="text-[#F1F4F9]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace("/");
          }}
        >
          <LogOut className="stroke-primary" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
