"use client";
import type { Proposal } from "@/core/domain/entities/proposal";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, MessageCircleMore, User, User2 } from "lucide-react";
import type React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface KanbanCard {
  example?: false;
  card: Proposal;
  onClick: () => void;
  color: string;
  bucketId: string;
}

type Props =
  | KanbanCard
  | {
      example: true;
      card: Proposal;
      onClick?: () => void;
      color?: string;
      bucketId?: string;
    };

export const KanbanCard: React.FC<Props> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.card.id,
    data: {
      card: props.card,
      type: "Card",
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(
      transform
        ? {
            ...transform,
            scaleX: 1,
            scaleY: 1,
          }
        : null
    ),
  };

  if (isDragging || props.example) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[170px] w-full border-2 border-dashed border-[#E2E2E2] bg-[#F2F2F2] rounded-md"
      />
    );
  }

  return (
    <div
      onClick={() => props.onClick?.()}
      ref={setNodeRef}
      style={{ ...style }}
      {...attributes}
      {...listeners}
      className={cn(
        "flex flex-col rounded-md overflow-hidden pt-5 pb-3 px-4 shadow relative border border-[#E2E2E2] hover:shadow-md cursor-pointer bg-white group",
        isDragging && "bg-red-500"
      )}
    >
      <div data-hidden={!props.card.tags.length} className="flex pb-3 gap-2">
        {props.card.tags.map((tag) => (
          <Badge key={tag.value} className={cn("bg-muted", tag.color)}>
            {tag.value}
          </Badge>
        ))}
      </div>
      <div className="flex flex-col pb-3 flex-1 gap-2">
        <h4 className="font-semibold text-[#323232] transition-colors">
          {props.card.title}
        </h4>
        <div className="flex items-start justify-start gap-2">
          <User2 className="stroke-[0.9px]" size={14} />
          <p className="font-light text-sm text-muted-foreground">
            {props.card.partner.name}
          </p>
        </div>
      </div>

      <hr />
      <div className="flex items-center pt-2 justify-between border-muted-foreground">
        <p className="text-lime-600">
          {props.card.amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <div className="flex items-center justify-end gap-4 text-xs">
          <div className="flex gap-2 items-center pr-4">
            <MessageCircleMore size={16} className="stroke-muted-foreground" />
            <span className="text-muted-foreground font-light text-sm">
              {props.card.followUps.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
