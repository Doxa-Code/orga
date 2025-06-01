"use client";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CreateRecordModal } from "./ClienteRecordModal";
import { KanbanBucket } from "./kanban-bucket";
import { KanbanCard } from "./kanban-card";
import { ModalFollowUp } from "./modal-follow-up";

export type Bucket = {
  id: string;
  order: number;
  name: string;
  color: string;
};
export type Card = {
  id: string;
  order: number;
  step: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  lastContact: Date;
  followUps: [
    {
      id: string;
      date: Date;
      type: string;
      notes: string;
    },
  ];
  appointments: [
    {
      id: string;
      title: string;
      description: string;
      dueDate: Date;
      completed: false;
    },
  ];
  createdAt: Date;
};

const initialCards: Card[] = [
  {
    id: "8",
    order: 0,
    step: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 99999-9999",
    company: "Tech Solutions",
    value: 15000,
    lastContact: new Date("2024-01-20"),
    followUps: [
      {
        id: "1",
        date: new Date("2024-01-20"),
        type: "call",
        notes: "Primeira ligação de apresentação",
      },
    ],
    appointments: [
      {
        id: "1",
        title: "Enviar proposta comercial",
        description: "Elaborar proposta detalhada com preços e cronograma",
        dueDate: new Date("2024-01-25"),
        completed: false,
      },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "9",
    order: 0,
    step: "2",
    name: "Maria Santos",
    email: "maria@startup.com",
    phone: "(11) 88888-8888",
    company: "StartupXYZ",
    value: 25000,
    lastContact: new Date("2024-01-22"),
    followUps: [
      {
        id: "2",
        date: new Date("2024-01-22"),
        type: "meeting",
        notes: "Reunião de discovery",
      },
    ],
    appointments: [
      {
        id: "2",
        title: "Agendar demonstração",
        description: "Preparar demo personalizada",
        dueDate: new Date("2024-01-28"),
        completed: false,
      },
    ],
    createdAt: new Date("2024-01-10"),
  },
];

const initialBuckets: Bucket[] = [
  { id: "1", name: "Novos Leads", color: "#D3D3D3", order: 0 },
  { id: "2", name: "Qualificados", color: "#3B82F6", order: 1 },
  { id: "3", name: "Proposta Enviada", color: "#8B5CF6", order: 2 },
  { id: "4", name: "Negociação", color: "#10B981", order: 3 },
  { id: "5", name: "Fechado", color: "#EF4444", order: 4 },
];

export const Kanban: React.FC = () => {
  const [buckets, setBuckets] = useState<Bucket[]>(initialBuckets);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBucketId, setSelectedBucketId] = useState<string>("");
  const [isAddingBucket, setIsAddingBucket] = useState(false);
  const [activeBucket, setActiveBucket] = useState<Bucket | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

  const handleClientClick = (card: Card) => {
    setSelectedCard(card);
    setIsClientModalOpen(true);
  };

  const handleUpdateClient = (updatedCard: Card) => {
    // setBuckets((prev) =>
    //   prev.map((bucket) => ({
    //     ...bucket,
    //     clients: bucket.clients.map((client) =>
    //       client.id === updatedCard.id ? updatedCard : client,
    //     ),
    //   })),
    // );
    // setSelectedCard(updatedCard);
  };

  const handleCreateRecord = (bucketId: string) => {
    setSelectedBucketId(bucketId);
    setIsCreateModalOpen(true);
  };

  const handleAddClient = (card: Card) => {
    // setBuckets((prev) =>
    //   prev.map((bucket) =>
    //     bucket.id === selectedBucketId
    //       ? { ...bucket, clients: [...bucket.clients, newClient] }
    //       : bucket,
    //   ),
    // );
    // setIsCreateModalOpen(false);
  };

  const handleDeleteBucket = (bucketId: string) => {
    setBuckets((buckets) => buckets.filter((bucket) => bucket.id !== bucketId));
    setCards((cards) => cards.filter((card) => card.step !== bucketId));
  };

  const handleRenameBucket = (bucketId: string, newName: string) => {
    setBuckets((buckets) =>
      buckets.map((bucket) =>
        bucket.id === bucketId ? { ...bucket, name: newName } : bucket,
      ),
    );
  };

  const handleAddBucket = (bucketName: string) => {
    if (bucketName.trim()) {
      const newBucket: Bucket = {
        id: crypto.randomUUID().toString(),
        name: bucketName,
        color: "#efefef",
        order: buckets.length + 1,
      };
      setBuckets((buckets) => [...buckets, newBucket]);
      setIsAddingBucket(false);
    }
  };

  function onDragEnd(event: DragEndEvent) {
    setActiveBucket(null);
    setActiveCard(null);

    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id.toString();

    if (activeId === overId) return;

    if (active.data.current?.card?.step === over.data.current?.bucket?.id)
      return;

    setBuckets((prev) => {
      const activeIndex = prev.findIndex((b) => b.id === activeId);
      const overIndex = prev.findIndex((b) => b.id === overId);
      const newBuckets = arrayMove(prev, activeIndex, overIndex);
      return newBuckets.map((b, i) => ({ ...b, order: i }));
    });
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Bucket") {
      setActiveBucket(event.active.data.current?.bucket);
      return;
    }
    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current?.card);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id.toString();

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";

    if (!isActiveACard) return;

    if (isActiveACard && isOverACard) {
      setCards((prevCards) => {
        const activeIndex = prevCards.findIndex((c) => c.id === activeId);
        const overIndex = prevCards.findIndex((c) => c.id === overId);
        const activeCard = prevCards[activeIndex];
        const overCard = prevCards[overIndex];

        const sourceStep = activeCard.step;
        const targetStep = overCard.step;

        // Se está apenas movendo dentro do mesmo bucket
        if (sourceStep === targetStep) {
          const cardsInStep = prevCards
            .filter((c) => c.step === sourceStep)
            .sort((a, b) => a.order - b.order);

          const from = cardsInStep.findIndex((c) => c.id === activeId);
          const to = cardsInStep.findIndex((c) => c.id === overId);

          const reordered = arrayMove(cardsInStep, from, to).map(
            (card, index) => ({
              ...card,
              order: index,
            }),
          );

          // Substitui os cards atualizados na lista original
          const updatedCards = prevCards.map((card) => {
            const updated = reordered.find((c) => c.id === card.id);
            return updated ?? card;
          });

          return updatedCards;
        }

        // Se está mudando de bucket
        const sourceCards = prevCards
          .filter((c) => c.step === sourceStep && c.id !== activeId)
          .sort((a, b) => a.order - b.order);

        const targetCards = prevCards
          .filter((c) => c.step === targetStep)
          .sort((a, b) => a.order - b.order);

        const insertIndex = targetCards.findIndex((c) => c.id === overId);

        // Insere o card movido no local correto do novo bucket
        const newTargetCards = [
          ...targetCards.slice(0, insertIndex),
          { ...activeCard, step: targetStep },
          ...targetCards.slice(insertIndex),
        ].map((card, index) => ({ ...card, order: index }));

        // Atualiza os sourceCards com nova ordem também
        const newSourceCards = sourceCards.map((card, index) => ({
          ...card,
          order: index,
        }));

        // Junta tudo
        const updatedCards = prevCards.map((card) => {
          const updated =
            newTargetCards.find((c) => c.id === card.id) ??
            newSourceCards.find((c) => c.id === card.id);
          return updated ?? card;
        });

        return updatedCards;
      });
    }

    const isOverABucket = over.data.current?.type === "Bucket";

    if (isActiveACard && isOverABucket) {
      setCards((cards) => {
        const activeCard = cards.find((c) => c.id === activeId);
        if (!activeCard) return cards;

        const sameStepCards = cards
          .filter((c) => c.step === overId && c.id !== activeId)
          .sort((a, b) => a.order - b.order);

        return cards.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              step: overId,
              order: sameStepCards.length, // coloca no final
            };
          }
          return c;
        });
      });
    }
  }

  return (
    <div className="w-full h-full flex Z-10 flex-1 mx-auto">
      <DndContext
        onDragOver={onDragOver}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <div className="flex flex-1 gap-4 overflow-x-auto pb-6">
          <SortableContext items={buckets.map((b) => b.id)}>
            {[...buckets]
              .sort((a, b) => a.order - b.order)
              .map((bucket) => (
                <KanbanBucket
                  key={bucket.id}
                  bucket={bucket}
                  cards={[...cards]
                    .filter((c) => c.step === bucket.id)
                    .sort((a, b) => a.order - b.order)}
                  onClickCard={handleClientClick}
                  onCreateCard={handleCreateRecord}
                  onDelete={handleDeleteBucket}
                  onRename={(newName: string) =>
                    handleRenameBucket(bucket.id, newName)
                  }
                />
              ))}
          </SortableContext>

          {typeof document !== "undefined" &&
            createPortal(
              <DragOverlay>
                {activeBucket && (
                  <KanbanBucket
                    cards={[...cards]
                      .filter((c) => c.step === activeBucket.id)
                      .sort((a, b) => a.order - b.order)}
                    bucket={activeBucket}
                    onClickCard={handleClientClick}
                    onCreateCard={() => handleCreateRecord(activeBucket.id)}
                    onDelete={() => handleDeleteBucket(activeBucket.id)}
                    onRename={(newName: string) =>
                      handleRenameBucket(activeBucket.id, newName)
                    }
                  />
                )}
                {activeCard && (
                  <KanbanCard
                    bucketId=""
                    card={activeCard}
                    color=""
                    onClick={() => {}}
                  />
                )}
              </DragOverlay>,
              document.body,
            )}

          {/* Add New Bucket */}
          <div className="min-w-80 p-4">
            <header className="border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                {isAddingBucket ? (
                  <Input
                    placeholder="Nome do bucket"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddBucket(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    onBlur={(e) => {
                      if (e.currentTarget.value) {
                        handleAddBucket(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                      setIsAddingBucket(false);
                    }}
                    className="border-x-0 border-t-0 border-b-primary border-b-2 bg-muted rounded-none"
                    autoFocus
                  />
                ) : (
                  <div
                    onDoubleClick={() => {
                      setIsAddingBucket(true);
                    }}
                    className="flex items-center justify-between cursor-pointer select-none w-full gap-2 flex-1"
                  >
                    <h3 className="font-semibold text-gray-900">
                      Adicionar novo bucket
                    </h3>
                  </div>
                )}
              </div>
            </header>
          </div>
        </div>
      </DndContext>
      {/* Modals */}
      {selectedCard && (
        <ModalFollowUp
          client={selectedCard}
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          onUpdateClient={handleUpdateClient}
        />
      )}

      <CreateRecordModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddClient={handleAddClient}
      />
    </div>
  );
};
