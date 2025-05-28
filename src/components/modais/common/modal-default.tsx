"use client";

import { Heading } from "@/components/typograph";
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
      <DrawerContent className="flex h-screen bg-muted w-full items-center !p-0 outline-none">
        <DrawerHeader
          data-hidden={!props.title}
          className={cn(
            "w-full border-b text-left bg-primary data-[hidden=true]:hidden",
            props.headerClassName,
          )}
        >
          <div className="container mx-auto px-0">
            <Heading className="font-medium text-white" level={1}>
              {props.title}
            </Heading>
          </div>
        </DrawerHeader>
        <div className="container flex-1 px-0 bg-muted overflow-auto py-3">
          {props.children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
