"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  onContinue(): void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export function ModalConfirm(props: Props) {
  return (
    <AlertDialog open={props?.open} onOpenChange={props?.setOpen}>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex gap-2">
            <AlertTriangle className="text-red-500" /> Você tem certeza
            absoluta?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita e será permanentemente nos nossos
            servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-400"
            onClick={() => props.onContinue?.()}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
