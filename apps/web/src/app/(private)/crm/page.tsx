"use client";
import {
  deleteBucket,
  deleteProposal,
  listBuckets,
  listProposals,
  upsertBucket,
  upsertProposals,
} from "@/app/actions/crm";
import {
  QueryKeyFactory,
  useServerActionMutation,
  useServerActionQuery,
} from "@/app/actions/query-key-factory";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";
import { InputSearch } from "@/components/inputs/common/input-search";
import { Toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanBucket } from "@/components/crm/kanban-bucket";
import { KanbanCard } from "@/components/crm/kanban-card";
import { ModalCreateProposal } from "@/components/crm/modal-create-proposal";
import { ModalProposalFollowUp } from "@/components/crm/modal-proposal-follow-up";

export default function CRMPage() {
  const { data: initialBuckets, ...listBucketsAction } = useServerActionQuery(
    listBuckets,
    {
      input: undefined,
      queryKey: QueryKeyFactory.listBuckets(),
    }
  );
  const { data: initialCards, ...listProposalAction } = useServerActionQuery(
    listProposals,
    {
      input: undefined,
      queryKey: QueryKeyFactory.listProposals(),
    }
  );
  const deleteBucketAction = useServerActionMutation(deleteBucket, {
    onError(error) {
      Toast.error("Erro ao deletar bucket", error.message);
    },
  });
  const upsertBucketAction = useServerActionMutation(upsertBucket, {
    onError(error) {
      Toast.error("Erro no registro do bucket", error.message);
    },
  });
  const upsertBucketActionDebounced = useDebouncedCallback(
    upsertBucketAction.mutate,
    1000
  );
  const upsertProposalsAction = useServerActionMutation(upsertProposals, {
    onError(error) {
      Toast.error("Erro no registro da proposta", error.message);
    },
  });
  const upsertProposalsActionDebounced = useDebouncedCallback(
    upsertProposalsAction.mutate,
    700
  );
  const deleteProposalAction = useServerActionMutation(deleteProposal, {
    onError(error) {
      Toast.error("Erro ao deletar proposta", error.message);
    },
  });
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

  useEffect(() => {
    const result = new Map<string, Proposal[]>();

    initialCards?.map((card) => {
      const list = result.get(card.stage) ?? [];
      list.push(
        Proposal.fromRaw({
          ...card,
          partner: {
            ...card.partner,
            contacts: card.partner.contacts.map((c) => ({
              ...c,
              phone: c.phone ?? "",
            })),
          },
        })
      );
      result.set(card.stage, list);
    });

    setCards(result);
    setBuckets(initialBuckets?.map((bucket) => Bucket.instance(bucket)) ?? []);
  }, [initialCards, initialBuckets]);

  const filteredCards = useMemo(() => {
    if (!filter) return cards;

    const result = new Map<string, Proposal[]>();

    for (const [stage, proposals] of cards.entries()) {
      const filtered = proposals.filter(
        (c) =>
          c?.partner?.name?.toLowerCase()?.includes(filter.toLowerCase()) ||
          c?.partner?.taxId?.value
            ?.toLowerCase()
            ?.includes(filter.toLowerCase()) ||
          c?.partner?.email?.value
            ?.toLowerCase()
            ?.includes(filter.toLowerCase()) ||
          c?.partner?.phone?.value
            ?.toLowerCase()
            ?.includes(filter.toLowerCase()) ||
          c?.title?.toLowerCase()?.includes(filter.toLowerCase()) ||
          c?.description?.toLowerCase()?.includes(filter.toLowerCase())
      );
      if (filtered.length > 0) {
        result.set(stage, filtered);
      }
    }

    return result;
  }, [cards, filter]);

  const handleDeleteProposal = (bucketName: string, proposalId: string) => {
    const newCards = new Map(cards);
    const list = newCards.get(bucketName) ?? [];
    newCards.set(
      bucketName,
      list.filter((c) => c.id !== proposalId)
    );
    setCards(newCards);
    deleteProposalAction.mutate({ id: proposalId });
  };

  const handleUpsertProposal = (proposal: Proposal) => {
    const newCards = new Map(cards);

    for (const bucket of buckets) {
      const cards = newCards.get(bucket.name) ?? [];
      const onThisBucket = cards.some((c) => c.id === proposal.id);
      const sameBucket = bucket.name === proposal.stage;
      if (onThisBucket && sameBucket) {
        const newList = cards.map((c) => (c.id === proposal.id ? proposal : c));
        upsertProposalsActionDebounced(newList.map((p) => p.raw()));
        newCards.set(bucket.name, newList);
        continue;
      }
      if (sameBucket && !onThisBucket) {
        const newList = [...cards, proposal].map((p, i) => p.setPosition(i));
        upsertProposalsActionDebounced(newList.map((p) => p.raw()));
        newCards.set(bucket.name, newList);
        continue;
      }
      newCards.set(
        bucket.name,
        cards.filter((c) => c.id !== proposal.id)
      );
    }

    setCards(newCards);
  };

  const handleAddProposal = (proposal: Proposal) => {
    const newCards = new Map(cards);
    const bucket = buckets.find((b) => b.name === proposal.stage);
    if (!bucket) return;
    const oldCards = newCards.get(bucket.name) ?? [];
    const newList = [...oldCards, proposal].map((p, i) => p.setPosition(i));
    upsertProposalsActionDebounced(newList.map((p) => p.raw()));
    newCards.set(bucket.name, newList);
    setCards(newCards);
  };

  const handleDeleteBucket = (bucketId: string) => {
    const bucket = buckets.find((bucket) => bucket.id === bucketId);
    if (!bucket) return;
    deleteBucketAction.mutate({ id: bucketId });
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
    upsertBucketActionDebounced([
      {
        id: bucket.id,
        name: newName,
        color: bucket.color,
        position: bucket.position,
      },
    ]);
  };

  const handleAddBucket = (bucketName: string) => {
    if (bucketName.trim()) {
      const newBucket = Bucket.create(bucketName);
      const newList = [...buckets, newBucket].map((b, i) => b.setPosition(i));
      setBuckets(newList);
      upsertBucketActionDebounced(newList.map((b) => b.raw()));
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

      const newList = arrayMove(bucketList, activeIndex, overIndex).map(
        (p, i) => p.setPosition(i)
      );

      upsertProposalsActionDebounced(newList.map((p) => p.raw()));

      newCards.set(activeCard.stage, newList);

      setCards(newCards);
      return;
    }

    if (overBucket) {
      const newBoard = new Map(cards);
      const oldBucketList = newBoard.get(activeCard.stage) ?? [];
      const targetBucketList = newBoard.get(overBucket.name) ?? [];

      if (targetBucketList.some((c) => c.id === activeCard.id)) return;

      const oldList = oldBucketList
        .filter((c) => c.id !== activeCard.id)
        .map((p, i) => p.setPosition(i));

      newBoard.set(activeCard.stage, oldList);

      upsertProposalsActionDebounced(oldList.map((p) => p.raw()));

      activeCard.changeStage(overBucket.name);

      const newList = [...targetBucketList, activeCard].map((p, i) =>
        p.setPosition(i)
      );

      newBoard.set(overBucket.name, newList);

      upsertProposalsActionDebounced(newList.map((p) => p.raw()));

      setCards(newBoard);
      return;
    }

    if (!overCard) return;

    const newCards = new Map(cards);
    const activeBucketList = newCards.get(activeCard.stage) ?? [];
    const overBucketList = newCards.get(overCard?.stage) ?? [];

    const activeList = activeBucketList
      .filter((c) => c.id !== activeCard.id)
      .map((p, i) => p.setPosition(i));

    newCards.set(activeCard.stage, activeList);

    upsertProposalsActionDebounced(activeList.map((p) => p.raw()));

    activeCard.changeStage(overCard?.stage);

    const targetBucketList = [...overBucketList, activeCard];

    const activeIndex = targetBucketList.findIndex(
      (c) => c.id === activeCard.id
    );

    const overIndex = targetBucketList.findIndex((c) => c.id === overCard.id);

    const newList = arrayMove(targetBucketList, activeIndex, overIndex).map(
      (p, i) => p.setPosition(i)
    );

    newCards.set(activeCard.stage, newList);

    upsertProposalsActionDebounced(newList.map((p) => p.raw()));

    setCards(newCards);
  }, 100);

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveBucket(null);
      setActiveCard(null);

      const { active, over } = event;

      const activeBucket = active.data.current?.bucket as Bucket;
      const overBucket = over?.data?.current?.bucket as Bucket;

      if (!activeBucket || !overBucket || activeBucket.id === overBucket.id)
        return;

      const activeIndex = buckets.findIndex((b) => b.id === activeBucket.id);
      const overIndex = buckets.findIndex((b) => b.id === overBucket.id);

      const newBuckets = arrayMove(buckets, activeIndex, overIndex).map(
        (bucket, i) => bucket.setPosition(i)
      );

      setBuckets(newBuckets);

      upsertBucketActionDebounced(newBuckets.map((b) => b.raw()));
    },
    [buckets]
  );
  return (
    <main className="flex flex-col flex-1 overflow-hidden">
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
        <div className="w-full bg-white shadow rounded py-6 px-0 gap-4 flex flex-col flex-1 justify-center items-start overflow-hidden">
          <div className="px-6 w-full">
            <InputSearch onSearch={setFilter} />
          </div>

          <div
            data-hidden={
              !(listBucketsAction.isPending || listProposalAction.isPending)
            }
            className="flex flex-1 justify-center pl-4 overflow-x-auto pr-10 py-4 gap-4 items-center"
          >
            <Skeleton className="w-screen max-w-96 h-screen flex-1 bg-background" />
            <Skeleton className="w-screen max-w-96 h-screen flex-1 bg-background" />
            <Skeleton className="w-screen max-w-96 h-screen flex-1 bg-background" />
            <Skeleton className="w-screen max-w-96 h-screen flex-1 bg-background" />
            <Skeleton className="w-screen max-w-96 h-screen flex-1 bg-background" />
            <Skeleton className="w-screen max-w-96 h-screen flex-1 bg-background" />
            <Skeleton className="w-screen max-w-96 h-screen flex-1 bg-background" />
          </div>

          <DndContext
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            sensors={sensors}
          >
            <div
              data-hidden={
                listBucketsAction.isPending || listProposalAction.isPending
              }
              className="flex flex-1 gap-4 py-4 overflow-x-auto pl-4 pr-10 w-full"
            >
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
                        totalAmount={cards.reduce(
                          (acc, card) => acc + card.amount,
                          0
                        )}
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
                      <KanbanBucket example bucket={activeBucket} />
                    )}
                    {activeCard && <KanbanCard example card={activeCard} />}
                  </DragOverlay>,
                  document.body
                )}

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
            onUpsertProposal={handleUpsertProposal}
            stages={buckets.map((b) => b.name)}
            onDelete={handleDeleteProposal}
          />
        )}

        <ModalCreateProposal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={handleAddProposal}
        />
      </div>
    </main>
  );
}
