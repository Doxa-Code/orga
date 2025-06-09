"use client";

import { Heading } from "@/components/common/typograph";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { useModais } from "@/hooks/use-modais";
import { cn } from "@/lib/utils";
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
      <DrawerContent className="flex z-[1000] h-screen bg-background w-full items-center !p-0 outline-none">
        <DrawerHeader
          data-hidden={!props.title}
          className={cn(
            "w-full border-b text-left bg-primary data-[hidden=true]:hidden",
            props.headerClassName
          )}
        >
          <div className="container mx-auto px-0">
            <Heading className="font-medium text-white" level={1}>
              {props.title}
            </Heading>
          </div>
        </DrawerHeader>
        <div className="container flex-1 px-0 overflow-y-auto pt-3 pb-44">
          {props.children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
