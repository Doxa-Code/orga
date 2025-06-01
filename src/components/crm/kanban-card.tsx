"use client";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, formatDistance } from "date-fns";
import { pt } from "date-fns/locale/pt";
import { Building, Calendar, MessageCircleMore, User } from "lucide-react";
import type React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import type { Card } from "./kanban";

interface KanbanCard {
  card: Card;
  onClick: () => void;
  color: string;
  bucketId: string;
}

export const KanbanCard: React.FC<KanbanCard> = (props) => {
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

  const daysSinceContact = props.card.lastContact
    ? Math.floor(
        (Date.now() - props.card.lastContact?.getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const style = {
    transition,
    transform: CSS.Transform.toString(
      transform
        ? {
            ...transform,
            scaleX: 1,
            scaleY: 1,
          }
        : null,
    ),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[184px] w-full border-2 border-dashed border-[#E2E2E2] bg-[#F2F2F2] rounded-md"
      />
    );
  }

  const lastAppointment = props?.card?.appointments
    ?.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))
    ?.find((a) => !a.completed)?.dueDate;

  return (
    <div
      onClick={() => props.onClick()}
      ref={setNodeRef}
      style={{ ...style }}
      {...attributes}
      {...listeners}
      className={cn(
        "flex flex-col gap-3 rounded-md overflow-hidden p-4 shadow relative border border-[#E2E2E2] hover:shadow-md cursor-pointer bg-white group",
        isDragging && "bg-red-500",
      )}
    >
      <Badge
        className={cn(
          "flex items-center gap-2",
          daysSinceContact > 7 ? "bg-[#FAFAFA]" : "bg-primary/10",
        )}
      >
        <Calendar
          className={cn(
            "w-4 h-4",
            daysSinceContact > 7 ? "stroke-rose-500" : "text-primary",
          )}
        />
        <span
          className={cn(
            daysSinceContact > 7 ? "text-rose-500 font-medium" : "text-primary",
          )}
        >
          {props.card.lastContact.toLocaleDateString("pt-BR")}
        </span>
      </Badge>
      <div className="flex flex-col gap-2">
        <h4 className="font-semibold text-lg text-[#212121] transition-colors">
          {props.card.name}
        </h4>
        <div className="flex items-center gap-2">
          <Building size={14} />
          <p className="font-normal text-xs text-muted-foreground">
            {props.card.company}
          </p>
        </div>
      </div>

      <hr />
      <div className="flex items-center justify-between border-gray-200">
        <Avatar className="p-1 bg-muted">
          <AvatarFallback>
            <User size={16} className="stroke-gray-500 size-[20px]" />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-end gap-4 text-xs">
          <div className="flex gap-2 items-center border-r pr-4">
            <MessageCircleMore size={16} className="stroke-gray-400" />
            <span className="text-gray-500 text-sm">
              {props.card.followUps.length}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <Calendar size={16} className="stroke-gray-400" />
            <span className="text-gray-500 text-sm">
              {lastAppointment &&
                formatDistance(lastAppointment, new Date(), {
                  addSuffix: true,
                  locale: pt,
                })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
