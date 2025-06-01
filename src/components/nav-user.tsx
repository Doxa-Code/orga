"use client";

import {
  BadgeCheck,
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo } from "react";
import { Button } from "./ui/button";

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded h-auto bg-transparent hover:bg-muted flex gap-4"
        >
          <Avatar className="h-7 w-7 bg-gray-200 rounded-full">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs">
              <User className="size-[16px]" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-4 items-start">
            <span className="text-black/90">{name}</span>
            <span className="text-muted-foreground font-light">
              {user.email}
            </span>
          </div>
          <ChevronDown className="text-black/80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuItem>
          <LogOut className="stroke-primary" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
