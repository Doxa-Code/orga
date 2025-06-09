"use client";
import { Input } from "@/components/ui/input";
import { Bucket } from "@/core/domain/entities/bucket";
import { Proposal } from "@/core/domain/entities/proposal";
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
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useThrottledCallback } from "use-debounce";
import { InputSearch } from "../inputs/common/input-search";
import { Button } from "../ui/button";
import { KanbanBucket } from "./kanban-bucket";
import { KanbanCard } from "./kanban-card";
import { ModalCreateProposal } from "./modal-create-proposal";
import { ModalProposalFollowUp } from "./modal-proposal-follow-up";

type Props = {
  initialBuckets: Bucket.Props[];
  initialCards: Proposal.Raw[];
};

export const Kanban: React.FC<Props> = ({ initialBuckets, initialCards }) => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [cards, setCards] = useState<Map<string, Proposal[]>>(new Map());
  const [selectedCard, setSelectedCard] = useState<Proposal | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddingBucket, setIsAddingBucket] = useState(false);
  const [activeBucket, setActiveBucket] = useState<Bucket | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [activeCard, setActiveCard] = useState<Proposal | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  useLayoutEffect(() => {
    const result = new Map<string, Proposal[]>();

    initialCards.map((card) => {
      const list = result.get(card.stage) ?? [];
      list.push(Proposal.fromRaw(card));
      result.set(card.stage, list);
    });

    setCards(result);

    setBuckets(initialBuckets.map((bucket) => Bucket.instance(bucket)));
  }, []);

  const filteredCards = useMemo(() => {
    if (!filter) return cards;

    const result = new Map<string, Proposal[]>();

    for (const [stage, proposals] of cards.entries()) {
      const filtered = proposals.filter((c) =>
        c.title.toLowerCase().includes(filter.toLowerCase())
      );
      if (filtered.length > 0) {
        result.set(stage, filtered);
      }
    }

    return result;
  }, [cards, filter]);

  const handleUpdateClient = (updatedCard: Proposal) => {
    setCards((prev) => {
      const newCards = new Map(prev);
      for (const bucket of buckets) {
        const cards = newCards.get(bucket.name) ?? [];
        const oldCards = cards.filter((c) => c.id !== updatedCard.id);
        if (bucket.name === updatedCard.stage) {
          newCards.set(bucket.name, [...oldCards, updatedCard]);
          continue;
        }
        newCards.set(bucket.name, oldCards);
      }

      return newCards;
    });
  };

  const handleAddClient = (card: Proposal) => {
    setCards((prev) => {
      const newCards = new Map(prev);
      const oldCards = newCards.get(card.stage) ?? [];
      newCards.set(card.stage, [...oldCards, card]);
      return newCards;
    });
  };

  const handleDeleteBucket = (bucketId: string) => {
    const bucket = buckets.find((bucket) => bucket.id === bucketId);
    if (!bucket) return;
    setBuckets((buckets) => buckets.filter((bucket) => bucket.id !== bucketId));
    setCards((cards) => {
      const newCards = new Map(cards);
      newCards.delete(bucket.name);
      return newCards;
    });
  };

  const handleRenameBucket = (bucketId: string, newName: string) => {
    const bucket = buckets.find((bucket) => bucket.id === bucketId);
    if (!bucket) return;
    const newCards = new Map(cards);
    const list = newCards.get(bucket.name) ?? [];
    newCards.delete(bucket.name);
    newCards.set(newName, list);
    setCards(newCards);
    bucket.setName(newName);
    setBuckets(buckets.map((b) => (b.id === bucketId ? bucket : b)));
  };

  const handleAddBucket = (bucketName: string) => {
    if (bucketName.trim()) {
      const newBucket = Bucket.create(bucketName);
      setBuckets((buckets) => [...buckets, newBucket]);
      setIsAddingBucket(false);
    }
  };

  const onDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === "Bucket") {
      setActiveBucket(event.active.data.current?.bucket);
      return;
    }
    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current?.card);
      return;
    }
  }, []);

  const onDragOver = useThrottledCallback((event: DragOverEvent) => {
    const { active, over } = event;

    const activeCard = active.data.current?.card as Proposal;

    if (!activeCard) return;

    const overCard = over?.data?.current?.card as Proposal;
    const overBucket = over?.data?.current?.bucket as Bucket;

    if (activeCard.stage === overBucket?.name) return;

    if (activeCard.stage === overCard?.stage) {
      const newCards = new Map(cards);
      const bucketList = newCards.get(activeCard.stage) ?? [];
      const activeIndex = bucketList.findIndex((c) => c.id === activeCard.id);
      const overIndex = bucketList.findIndex((c) => c.id === overCard.id);

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex)
        return;
      console.log("active card stage eq over card stage");

      newCards.set(
        activeCard.stage,
        arrayMove(bucketList, activeIndex, overIndex).map((c, i) =>
          c.setPosition(i)
        )
      );

      setCards(newCards);
      return;
    }

    if (overBucket) {
      const newBoard = new Map(cards);
      const oldBucketList = newBoard.get(activeCard.stage) ?? [];
      const targetBucketList = newBoard.get(overBucket.name) ?? [];

      if (targetBucketList.some((c) => c.id === activeCard.id)) return;

      newBoard.set(
        activeCard.stage,
        oldBucketList.filter((c) => c.id !== activeCard.id)
      );

      activeCard.changeStage(overBucket.name);

      newBoard.set(overBucket.name, [...targetBucketList, activeCard]);
      setCards(newBoard);
      return;
    }

    if (!overCard) return;

    const newCards = new Map(cards);
    const activeBucketList = newCards.get(activeCard.stage) ?? [];
    const overBucketList = newCards.get(overCard?.stage) ?? [];

    newCards.set(
      activeCard.stage,
      activeBucketList.filter((c) => c.id !== activeCard.id)
    );

    activeCard.changeStage(overCard?.stage);
    const targetBucketList = [...overBucketList, activeCard];
    const activeIndex = targetBucketList.findIndex(
      (c) => c.id === activeCard.id
    );
    const overIndex = targetBucketList.findIndex((c) => c.id === overCard.id);

    newCards.set(
      activeCard.stage,
      arrayMove(targetBucketList, activeIndex, overIndex).map((c, i) =>
        c.setPosition(i)
      )
    );

    setCards(newCards);
  }, 100);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveBucket(null);
      setActiveCard(null);

      const { active, over } = event;

      const activeBucket = active.data.current?.bucket as Bucket;
      const overBucket = over?.data?.current?.bucket as Bucket;

      if (!activeBucket || !overBucket || activeBucket.id === overBucket.id)
        return;
      setBuckets((buckets) => {
        const activeIndex = buckets.findIndex((b) => b.id === activeBucket.id);
        const overIndex = buckets.findIndex((b) => b.id === overBucket.id);

        return arrayMove(buckets, activeIndex, overIndex).map((b, i) =>
          b.setPosition(i)
        );
      });
    },
    [buckets]
  );

  return (
    <div className="w-full h-full flex p-10 gap-4 rounded-xl flex-col flex-1 mx-auto">
      <div>
        <Button
          onClick={() => {
            setIsCreateModalOpen(true);
          }}
          className="bg-secondary hover:bg-secondary hover:opacity-90"
        >
          Nova proposta
        </Button>
      </div>
      <div className="w-full bg-white shadow rounded py-6 px-0 gap-4 flex flex-col flex-1 justify-center items-start">
        <div className="px-6 w-full">
          <InputSearch onSearch={setFilter} />
        </div>
        <DndContext
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          sensors={sensors}
        >
          <div className="flex flex-1 gap-4 py-4 overflow-x-auto pl-4 pr-10 w-full">
            <SortableContext items={buckets.map((b) => b.id)}>
              {buckets
                .sort((a, b) => a.position - b.position)
                .map((bucketProps) => {
                  const bucket = Bucket.instance(bucketProps);
                  const cards = (filteredCards?.get(bucket.name) ?? []).sort(
                    (a, b) => a.position - b.position
                  );
                  return (
                    <KanbanBucket
                      key={bucket.id}
                      bucket={bucket}
                      onCreateCard={() => setIsCreateModalOpen(true)}
                      onDelete={handleDeleteBucket}
                      onRename={(newName: string) =>
                        handleRenameBucket(bucket.id, newName)
                      }
                      ids={cards.map((c) => c.id)}
                    >
                      {cards.map((card) => (
                        <KanbanCard
                          key={card.id}
                          card={card}
                          onClick={() => setSelectedCard(card)}
                          color={bucket.color}
                          bucketId={bucket.id}
                        />
                      ))}
                    </KanbanBucket>
                  );
                })}
            </SortableContext>

            {typeof document !== "undefined" &&
              createPortal(
                <DragOverlay>
                  {activeBucket && (
                    <KanbanBucket example bucket={activeBucket}>
                      {(filteredCards?.get(activeBucket.name) ?? [])
                        .sort((a, b) => a.position - b.position)
                        .map((card) => (
                          <KanbanCard example key={card.id} card={card} />
                        ))}
                    </KanbanBucket>
                  )}
                  {activeCard && <KanbanCard example card={activeCard} />}
                </DragOverlay>,
                document.body
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
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsAddingBucket(true);
                      }}
                      className="flex items-center justify-between cursor-pointer select-none w-full gap-2 flex-1"
                    >
                      <h3 className="font-normal text-[#323232]">
                        Adicionar novo bucket
                      </h3>
                    </Button>
                  )}
                </div>
              </header>
            </div>
          </div>
        </DndContext>
      </div>

      {/* Modals */}
      {selectedCard && (
        <ModalProposalFollowUp
          proposal={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdateClient={handleUpdateClient}
          stages={buckets.map((b) => b.name)}
        />
      )}

      <ModalCreateProposal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdd={handleAddClient}
      />
    </div>
  );
};
