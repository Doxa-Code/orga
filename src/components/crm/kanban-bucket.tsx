import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal, MoreVertical, Plus, PlusCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { Bucket, Card } from "./kanban";
import { KanbanCard } from "./kanban-card";

interface KanbanBucketProps {
  bucket: Bucket;
  cards: Card[];
  onClickCard: (card: Card) => void;
  onCreateCard: (bucketId: string) => void;
  onDelete: (bucketId: string) => void;
  onRename: (newName: string) => void;
}

export const KanbanBucket: React.FC<KanbanBucketProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(props.bucket.name);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.bucket.id,
    data: {
      type: "Bucket",
      bucket: props.bucket,
    },
  });

  const handleRename = () => {
    if (editName.trim() && editName !== props.bucket.name) {
      props.onRename(editName);
    }
    setIsEditing(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        className="min-w-96 max-w-96 bg-[#F9F9F9] opacity-70 rounded-md border border-dashed border-[#efefef] flex flex-col gap-4 p-4 flex-1"
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
      className="min-w-96 max-w-96 h-full bg-[#F9F9F9] rounded-md border border-[#EFEFEF] !select-none flex flex-col flex-1 py-3 px-2 gap-4"
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
            className="flex items-center justify-between w-full gap-2 flex-1"
          >
            <div className="flex items-center gap-2 px-2 py-1 rounded-md">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: props.bucket.color,
                }}
              />
              <h3 className="font-normal text-[#0A0A0A]">
                {props.bucket.name}
              </h3>
              <span className="text-[#858587]">{props.cards.length}</span>
            </div>
            <div className="flex">
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
                      setEditName(props.bucket.name);
                      setIsEditing(true);
                    }}
                    className="px-4"
                  >
                    <span className="font-light">Renomear</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      props.onDelete(props.bucket.id);
                    }}
                    className="px-4"
                  >
                    <span className="font-light">Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => props.onCreateCard(props.bucket.id)}
                size="sm"
                variant="ghost"
                className="!py-0 !px-2 h-7 hover:bg-white/10 rounded"
              >
                <Plus className="h-4 w-4 stroke-[#69696B]" />
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="space-y-3 rounded-md flex-1">
        <SortableContext items={props.cards.map((c) => c.id)}>
          {props.cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onClick={() => props.onClickCard(card)}
              color={props.bucket.color}
              bucketId={props.bucket.id}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
