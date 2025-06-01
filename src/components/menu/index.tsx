"use client";

import { type ReactNode, useState } from "react";
import { NavUser } from "../nav-user";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
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
  const [open, setOpen] = useState(false);
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen max-h-screen overflow-hidden w-full flex-1 p-0"
    >
      <ResizablePanel
        defaultSize={5}
        data-open={open}
        className="absolute bg-muted z-40 flex w-[200px] -translate-x-full select-none flex-col gap-0 shadow duration-150 data-[open=true]:translate-x-0 md:static md:max-w-[200px] md:data-[open=false]:translate-x-0"
      >
        <Sidebar />
      </ResizablePanel>
      <ResizablePanel
        defaultSize={5}
        className="overflow-hidden bg-muted shadow flex flex-col"
      >
        <ResizablePanel
          defaultSize={5}
          className="z-50 w-full max-h-[60px] flex items-center justify-end bg-primary"
        >
          <NavUser user={props.user} />
        </ResizablePanel>
        <ResizablePanel
          defaultSize={5}
          className="overflow-hidden flex-1 flex flex-col p-6"
        >
          {props.children}
        </ResizablePanel>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
