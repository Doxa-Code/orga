"use client";

import { ResizablePanel, ResizablePanelGroup } from "@orga/ui/resizable";
import { type ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";

interface MenuProps {
  children: ReactNode;
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
        className="absolute z-40 flex w-[250px] -translate-x-full select-none flex-col gap-0 bg-white shadow duration-150 data-[open=true]:translate-x-0 md:static md:max-w-[250px] md:data-[open=false]:translate-x-0"
      >
        <Sidebar />
      </ResizablePanel>
      <ResizablePanel defaultSize={5} className="overflow-hidden flex flex-col">
        <ResizablePanel
          defaultSize={5}
          className="z-50 max-h-6 w-full bg-primary"
        />
        <ResizablePanel
          defaultSize={5}
          className="overflow-hidden flex-1 flex flex-col py-3"
        >
          {props.children}
        </ResizablePanel>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
