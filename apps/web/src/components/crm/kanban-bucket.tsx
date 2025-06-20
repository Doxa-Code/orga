import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { Bucket } from "@/core/domain/entities/bucket";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, MoreVertical, Plus, Trash } from "lucide-react";
import type React from "react";
import { type ReactNode, useState } from "react";
import { ModalConfirm } from "../modais/common/modal-confirm";

interface KanbanBucketProps {
  example?: false;
  bucket: Bucket;
  children?: ReactNode;
  ids?: string[];
  totalAmount: number;
  onCreateCard: (bucketId: string) => void;
  onDelete: (bucketId: string) => void;
  onRename: (newName: string) => void;
}

type Props =
  | KanbanBucketProps
  | {
      example: true;
      bucket?: Bucket;
      children?: ReactNode;
      totalAmount?: number;
      ids?: string[];
      onCreateCard?: (bucketId: string) => void;
      onDelete?: (bucketId: string) => void;
      onRename?: (newName: string) => void;
    };

export const KanbanBucket: React.FC<Props> = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(props.bucket?.name ?? "");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.bucket?.id ?? "",
    data: {
      type: "Bucket",
      bucket: props.bucket ?? null,
    },
  });

  const handleRename = () => {
    if (editName.trim() && editName !== props.bucket?.name) {
      props.onRename?.(editName);
    }
    setIsEditing(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging || props.example) {
    return (
      <div
        className="min-w-96 h-full max-w-96 bg-background opacity-70 rounded-md border border-dashed border-[#efefef] flex flex-col gap-4 p-4 flex-1"
        ref={setNodeRef}
        style={style}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="min-w-96 max-w-96 overflow-hidden !select-none flex flex-col flex-1 py-3 px-2 gap-4"
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        {isEditing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename();
                return;
              }
              if (e.key === "Escape") {
                setIsEditing(false);
                return;
              }
            }}
            className="border-x-0 border-t-0 border-b-primary border-b-2 bg-muted rounded-none"
            autoFocus
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditing(true)}
            className="flex items-center text-xs font-light justify-between w-full gap-2 flex-1"
          >
            <div className="flex items-center gap-2 px-2 py-1 rounded-md">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: props.bucket?.color ?? "",
                }}
              />
              <h3 className="font-normal text-[#323232]">
                {props.bucket?.name ?? "Exemplo"}
              </h3>
              <span className="text-muted-foreground font-light">
                ({props.ids?.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-lime-600 font-normal">
                {props.totalAmount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="!py-0 !px-2 h-7 hover:bg-white/10 rounded"
                    >
                      <MoreVertical className="h-4 w-4 stroke-[#69696B]" />
                    </Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditName(props.bucket?.name ?? "");
                      setIsEditing(true);
                    }}
                    className="px-4"
                  >
                    <span className="font-light">Renomear</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="px-4">
                    <ModalConfirm
                      onContinue={() => {
                        props.onDelete?.(props.bucket?.id ?? "");
                      }}
                    >
                      <div className="flex hover:bg-muted rounded items-center px-4 py-2 cursor-pointer gap-2">
                        <span className="text-xs text-rose-500 font-light">
                          Excluir
                        </span>
                      </div>
                    </ModalConfirm>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="space-y-3 overflow-y-auto bg-background p-4 rounded-md flex-1">
        <SortableContext items={props.ids ?? []}>
          {props.children}
        </SortableContext>
      </div>
    </div>
  );
};
