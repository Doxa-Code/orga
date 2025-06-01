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
import { MoreHorizontal, Plus } from "lucide-react";
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
        className="min-w-80 max-w-80 flex flex-col gap-4 p-4 flex-1"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <header className="flex items-center pt-1 justify-between">
          <div className="flex gap-2 items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-zinc-200" />
            <div className="w-32 bg-zinc-200 h-6" />
          </div>
          <div className="w-6 bg-zinc-200 h-3" />
        </header>
        <div className="w-full bg-zinc-200 h-10 mb-4" />
        {props.cards.map((card) => (
          <div key={card.id} className="w-full bg-zinc-200 h-[200px]" />
        ))}
      </div>
    );
  }

  return (
    <div
      className="min-w-80 max-w-80 !select-none flex flex-col flex-1 bg-transparent p-4 gap-4 cursor-move"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {/* Header */}
      <header className="border-b border-gray-100 flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: props.bucket.color,
                }}
              />
              <h3 className="font-semibold text-gray-900">
                {props.bucket.name}
              </h3>
              <span className="rounded-full font-light text-sm text-muted-foreground">
                {props.cards.length}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="!py-0 !px-2 h-7 rounded"
                  >
                    <MoreHorizontal className="h-4 w-4" />
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
          </div>
        )}
      </header>

      <Button
        onClick={() => props.onCreateCard(props.bucket.id)}
        variant="outline"
        size="sm"
        className="w-full justify-start border-none shadow rounded h-10 text-[#2A62B2] bg-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Cliente
      </Button>

      {/* Content */}
      <div className="space-y-3 mt-4 flex-1">
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
