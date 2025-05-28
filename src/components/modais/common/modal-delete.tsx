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
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";

type Props = {
  onContinue?: () => Promise<void>;
  children?: ReactNode;
};

export const ModalDelete: React.FC<Props> = (props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {props.children ?? (
          <Button
            size="sm"
            className="rounded text-primary h-7 shadow-none border !text-sm"
            variant="outline"
          >
            Excluir
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription className="font-light">
              Essa ação não pode ser revertida. Isso removerá permanentemente
              dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              props.onContinue?.();
            }}
            className="bg-red-600 hover:bg-red-500"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
