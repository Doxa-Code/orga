"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Building2, Calendar, Mail, Phone } from "lucide-react";
import type React from "react";
import { Checkbox } from "../ui/checkbox";
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
        className="h-52 w-full border-2 border-dashed border-rose-200 bg-rose-100 rounded-md"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style }}
      {...attributes}
      {...listeners}
      className="flex flex-col gap-4 rounded-md overflow-hidden p-4 border relative border-gray-200 hover:shadow-md cursor-pointer bg-white group"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-xl text-gray-900 transition-colors">
          {props.card.name}
        </h4>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span className="truncate">{props.card.company}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span className="truncate">{props.card.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{props.card.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span
            className={daysSinceContact > 7 ? "text-red-500 font-medium" : ""}
          >
            Último contato:{" "}
            {daysSinceContact === 0 ? "Hoje" : `${daysSinceContact}d atrás`}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {props.card.followUps.length} follow-up(s)
          </span>
          <span className="text-gray-500">
            {props.card.appointments.filter((step) => !step.completed).length}{" "}
            próximos passos
          </span>
        </div>
      </div>
    </div>
  );
};
