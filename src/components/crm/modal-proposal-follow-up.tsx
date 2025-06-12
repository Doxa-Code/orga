import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/components/ui/timeline";
import { FollowUp } from "@/core/domain/entities/follow-up";
import { Proposal } from "@/core/domain/entities/proposal";
import { Tag } from "@/core/domain/valueobjects/tag";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { formatRelative } from "date-fns";
import { pt } from "date-fns/locale/pt";
import {
  Calendar,
  File,
  HandshakeIcon,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  Trash,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { InputMoney } from "../inputs/common/input-money";
import { ModalConfirm } from "../modais/common/modal-confirm";
import { Select } from "../selects/common/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  proposal: Proposal;
  isOpen: boolean;
  onClose: () => void;
  onUpsertProposal: (proposal: Proposal) => void;
  stages: string[];
  onDelete: (bucketName: string, proposalId: string) => void;
}

export const ModalProposalFollowUp: React.FC<Props> = (props) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [proposal, setProposal] = useState<Proposal>(props.proposal);
  const timelineRef = useRef<HTMLUListElement>(null);
  const [selectedFollowUpType, setSelectedFollowUpType] =
    useState<FollowUp.Type>("call");
  const [followUpNotes, setFollowUpNotes] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const followUpIcons = useMemo(
    () =>
      new Map<string, React.ReactNode>([
        ["call", <PhoneCall className="size-3" />],
        ["email", <Mail className="size-3" />],
        ["meeting", <Calendar className="size-3" />],
        ["message", <MessageCircle className="size-3" />],
        ["other", <File className="size-3" />],
      ]),
    []
  );
  const followUpTypes = useMemo(
    () =>
      new Map<string, string>([
        ["call", "Ligação"],
        ["email", "Email"],
        ["meeting", "Reunião"],
        ["message", "Mensagem"],
        ["other", "Outro"],
      ]),
    []
  );

  const stages = useMemo(() => {
    return new Map([
      [
        "Novos Leads",
        { value: "Novos Leads", color: "bg-[#D3D3D3] text-[#595A5A]" },
      ],
      ["Qualificados", { value: "Qualificados", color: "bg-[#3B82F6]" }],
      [
        "Proposta Enviada",
        { value: "Proposta Enviada", color: "bg-[#8B5CF6]" },
      ],
      ["Negociação", { value: "Negociação", color: "bg-[#10B981]" }],
      ["Fechado", { value: "Fechado", color: "bg-[#EF4444]" }],
    ]) as Map<string, { value: string; color: string }>;
  }, []);

  useEffect(() => {
    if (props.isOpen) {
      setTimeout(() => {
        timelineRef.current?.scrollTo({
          top: timelineRef.current?.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [props.isOpen]);

  const handleAddFollowUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user || !selectedFollowUpType || !followUpNotes.trim()) return;

    proposal.addFollowUp(
      FollowUp.create({
        content: followUpNotes.trim(),
        createdBy: user.email ?? "",
        type: selectedFollowUpType,
      })
    );

    const newProposal = Proposal.instance(proposal);
    setProposal(newProposal);
    setSelectedFollowUpType("call");
    setFollowUpNotes("");
    props.onUpsertProposal(newProposal);
    setTimeout(() => {
      timelineRef.current?.scrollTo({
        top: timelineRef.current?.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const formatDate = (date: Date) => {
    return formatRelative(date, new Date(), { locale: pt });
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="max-w-[70vw] flex flex-col max-h-[80vh] h-screen bg-white shadow-lg rounded-xl p-0 border border-gray-200">
        <DialogHeader className="pt-8 max-h-[120px] px-8">
          <div className="w-full flex items-center justify-between">
            <div>
              {isEditingTitle ? (
                <Input
                  autoFocus
                  className="max-w-[200px] bg-muted border-none shadow-none !text-xl font-semibold !h-9 py-0 px-2"
                  value={proposal.title}
                  onChange={(e) => {
                    proposal.setTitle(e.target.value);
                    setProposal(Proposal.instance(proposal));
                  }}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    props.onUpsertProposal(proposal);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingTitle(false);
                      props.onUpsertProposal(proposal);
                    }
                  }}
                />
              ) : (
                <DialogTitle
                  onDoubleClick={() => setIsEditingTitle(true)}
                  className="text-xl flex min-w-[200px] min-h-10 cursor-pointer items-center gap-3"
                >
                  {proposal.title}
                </DialogTitle>
              )}
            </div>
            <div className="flex items-center justify-center gap-2">
              <ModalConfirm
                onContinue={() => {
                  props.onDelete(proposal.stage, proposal.id);
                  props.onClose();
                }}
              >
                <Button variant="ghost" size="icon">
                  <Trash className="size-4 stroke-muted-foreground stroke-1" />
                </Button>
              </ModalConfirm>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="w-4 h-4" />
                </Button>
              </DialogClose>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {proposal.tags.map((tag) => (
              <Badge
                key={tag.value}
                className={cn("rounded items-center justify-center", tag.color)}
              >
                {tag.value}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="flex overflow-hidden flex-1 border-t gap-0">
          <div className="flex flex-1 overflow-hidden pb-10 flex-col">
            <Timeline
              ref={timelineRef}
              className="flex-1 h-full border-b flex flex-col bg-gray-50 px-8 pt-5 pb-10 pr-10 overflow-y-auto"
            >
              {proposal.followUps.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-sm text-gray-500">
                    Nenhum follow-up registrado
                  </span>
                </div>
              )}
              {proposal.followUps.map((followUp) => (
                <TimelineItem key={followUp.id} status="done">
                  <TimelineDot
                    customIcon={followUpIcons.get(followUp.type) ?? null}
                    status="done"
                    className="w-8 h-8 bg-white"
                  />
                  <TimelineLine done />
                  <TimelineContent className="bg-white w-full rounded flex flex-col gap-1 shadow p-5">
                    <TimelineHeading className="font-normal text-base">
                      {followUpTypes.get(followUp.type) ?? "Outro"}
                    </TimelineHeading>
                    <span className="text-xs font-light text-gray-400">
                      {formatRelative(followUp.createdAt, new Date(), {
                        locale: pt,
                      })}{" "}
                      por {followUp.createdBy}
                    </span>
                    <p className="text-base font-light py-2 flex-1 text-gray-700">
                      {followUp.content}
                    </p>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>

            <form
              ref={formRef}
              onSubmit={handleAddFollowUp}
              className="space-y-4 px-8 border-gray-100 mt-6"
            >
              <div className="space-y-2">
                <Label>Tipo de contato</Label>
                <Select
                  className="max-w-[217px]"
                  options={["call", "email", "meeting", "message", "other"]}
                  selected={selectedFollowUpType}
                  render={(option) => (
                    <div className="flex gap-2 items-center">
                      {followUpIcons.get(option) ?? null}
                      {followUpTypes.get(option)}
                    </div>
                  )}
                  noSearchInput
                  noAddButton
                  noClearButton
                  onSelect={(selected) => {
                    setSelectedFollowUpType(selected as FollowUp.Type);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Follow-up</Label>
                <Textarea
                  placeholder="Digite suas notas aqui..."
                  className="max-h-[50px] resize-none h-screen"
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      (e.key === "Enter" && e.metaKey) ||
                      (e.key === "Enter" && e.ctrlKey)
                    ) {
                      e.preventDefault();
                      setFollowUpNotes((prev) => prev + "\n");
                      return;
                    }

                    if (e.key === "Enter") {
                      e.preventDefault();
                      formRef.current?.requestSubmit();
                      return;
                    }
                  }}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button size="sm">Salvar Follow-up</Button>
              </div>
            </form>
          </div>
          <div className="max-w-[20vw] w-full rounded-r-2xl p-6 space-y-5 border-l border-gray-100">
            <h3 className="text-lg font-medium text-[#595A5A]">Visão Geral</h3>

            <div className="space-y-2">
              <Label>Descrição</Label>
              {isEditingDescription ? (
                <Textarea
                  className="max-h-[100px] h-screen text-xs bg-muted shadow-none border-none resize-none"
                  value={proposal.description}
                  onChange={(e) => {
                    proposal.setDescription(e.target.value);
                    setProposal(Proposal.instance(proposal));
                  }}
                  onBlur={() => {
                    setIsEditingDescription(false);
                    props.onUpsertProposal(proposal);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingDescription(false);
                      props.onUpsertProposal(proposal);
                    }
                  }}
                />
              ) : (
                <p
                  onDoubleClick={() => setIsEditingDescription(true)}
                  className="font-light h-screen text-xs leading-6 overflow-y-auto max-h-[100px] bg-muted px-4 py-2 rounded text-muted-foreground"
                >
                  {proposal.description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-normal text-primary uppercase tracking-wide">
                Informações de Contato
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-light text-gray-700">
                    {proposal.partner?.name || "Não informado"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-light text-gray-700">
                    {proposal.partner.phone.value || "Não informado"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-light text-gray-700">
                    {proposal.partner?.email?.value || "Não informado"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <HandshakeIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-light text-gray-700">
                    Desde de {formatDate(proposal.partner.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-light text-gray-700">
                    Último contato
                    {proposal.lastFollowUp
                      ? ` dia ${formatDate(proposal.lastFollowUp.createdAt)}`
                      : " não registrado"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-normal text-primary uppercase tracking-wide">
                Informações Comerciais
              </h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Valor do Negócio</Label>
                  <InputMoney
                    classNameContainer="max-w-[217px]"
                    value={proposal.amount}
                    onChange={(value) => {
                      proposal.setAmount(Number(value));
                      setProposal(Proposal.instance(proposal));
                      props.onUpsertProposal(proposal);
                    }}
                  />
                </div>
                <div>
                  <Label>Tags</Label>
                  <Select
                    className="max-w-[217px]"
                    options={[
                      Tag.create("Lead quente", "bg-rose-500 text-white"),
                      Tag.create("Lead morno", "bg-yellow-400 text-white"),
                      Tag.create("Lead frio", "bg-sky-500 text-white"),
                    ]}
                    render={(option) => (
                      <Badge
                        className={cn(
                          "rounded items-center justify-center",
                          option.color
                        )}
                      >
                        {option.value}
                      </Badge>
                    )}
                    noSearchInput
                    noAddButton
                    value="value"
                    selected={proposal.tags[0] ?? null}
                    onSelect={(selected) => {
                      proposal.clearTag();
                      if (!selected) {
                        setProposal(Proposal.instance(proposal));
                        props.onUpsertProposal(proposal);
                        return;
                      }
                      proposal.addTags(selected);
                      setProposal(Proposal.instance(proposal));
                      props.onUpsertProposal(proposal);
                    }}
                  />
                </div>
                <div>
                  <Label>Estágio</Label>
                  <Select
                    className="max-w-[217px]"
                    options={Array.from(stages.values())}
                    render={(option) => (
                      <Badge
                        className={cn(
                          "rounded items-center justify-center",
                          option.color
                        )}
                      >
                        {option.value}
                      </Badge>
                    )}
                    noSearchInput
                    noAddButton
                    noClearButton
                    value="value"
                    selected={stages.get(proposal.stage) ?? null}
                    onSelect={(selected) => {
                      proposal.setStage(selected?.value ?? "");
                      setProposal(Proposal.instance(proposal));
                      props.onUpsertProposal(proposal);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
