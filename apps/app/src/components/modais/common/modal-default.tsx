"use client";

import { Heading } from "@/components/common/typograph";
import { useModais } from "@/hooks/use-modais";
import { cn } from "@orga";
import { Drawer, DrawerContent, DrawerHeader } from "@orga/ui/drawer";
import type { ReactNode } from "react";

interface ModalDefaultProps {
  modalName: string;
  children: ReactNode;
  title?: string;
  headerClassName?: string;
  open?: boolean;
}

export function ModalDefault(props: ModalDefaultProps) {
  const { modaisNames, closeModal } = useModais();

  return (
    <Drawer
      onOpenChange={(open) => !open && closeModal(props.modalName)}
      open={modaisNames.has(props.modalName)}
      direction="bottom"
      dismissible
      fixed
      modal
    >
      <DrawerContent className="flex h-screen w-full items-center bg-background !p-0 outline-none">
        <DrawerHeader
          data-hidden={!props.title}
          className={cn(
            "w-full border-b text-left bg-white data-[hidden=true]:hidden",
            props.headerClassName,
          )}
        >
          <div className="container mx-auto px-0">
            <Heading className="font-medium text-slate-800" level={1}>
              {props.title}
            </Heading>
          </div>
        </DrawerHeader>
        <div className="container flex-1 px-0 overflow-auto py-3">
          {props.children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
