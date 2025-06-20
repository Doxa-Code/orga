"use client";
import { REGISTER_PARTNER_MODAL_NAME } from "@/constants";
import { useModais } from "@/hooks/use-modais";
import { Button } from "./ui/button";
import { usePartner } from "@/hooks/use-partner";

export function HeaderPartners() {
  const { openModal } = useModais();
  const { set } = usePartner();
  return (
    <header>
      <Button
        size="sm"
        onClick={() => {
          set({
            partnerId: undefined,
            roleToCreate: undefined,
          });
          openModal(REGISTER_PARTNER_MODAL_NAME);
        }}
        className="bg-[#1C9B45] hover:bg-[#1C9B45] hover:opacity-80 rounded-[4px] py-5 text-sm px-4"
      >
        Novo cliente
      </Button>
    </header>
  );
}
