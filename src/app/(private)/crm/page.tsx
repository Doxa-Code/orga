import { Kanban } from "@/components/crm/kanban";
import { listPartners } from "./actions";
import { Proposal } from "@/core/domain/entities/proposal";
import { User } from "@/core/domain/entities/user";
import { Partner } from "@/core/domain/entities/partner";
import { Tag } from "@/core/domain/valueobjects/tag";
import { FollowUp } from "@/core/domain/entities/follow-up";
import { Bucket } from "@/core/domain/entities/bucket";

const initialCards: Proposal[] = [
  Proposal.create({
    amount: 15000,
    owner: User.create("User", "user@orgasaas.com.br"),
    partner: Partner.create({
      name: "Cliente",
      roles: ["CUSTOMER"],
      type: "INDIVIDUAL",
      workspaceId: "1",
    }),
    title: "Venda de Software 1",
    workspaceId: "1",
    description: "Saas para gestão empresarial",
    tags: [Tag.create("Lead quente")],
    segment: "Engenharia",
    source: "referral",
  }),
  Proposal.create({
    amount: 12000,
    owner: User.create("User", "user@orgasaas.com.br"),
    partner: Partner.create({
      name: "Cliente",
      roles: ["CUSTOMER"],
      type: "INDIVIDUAL",
      workspaceId: "1",
    }),
    title: "Migração de emails e servidores",
    workspaceId: "1",
    description: "Saas para gestão empresarial",
    tags: [Tag.create("Lead quente")],
    segment: "Engenharia",
    source: "referral",
  }),
  Proposal.create({
    amount: 12000,
    owner: User.create("User", "user@orgasaas.com.br"),
    partner: Partner.create({
      name: "Cliente",
      roles: ["CUSTOMER"],
      type: "INDIVIDUAL",
      workspaceId: "1",
    }),
    title: "Migração de emails e servidores",
    workspaceId: "1",
    description: "Saas para gestão empresarial",
    tags: [Tag.create("Lead quente")],
    segment: "Engenharia",
    source: "referral",
    stage: "Qualificados",
  }),
];

initialCards.at(0)?.addFollowUp(
  FollowUp.create({
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus, asperiores possimus. Ab, dolorum, aliquid incidunt odit doloribus nulla eum quos, maiores molestiae voluptatum ipsam quaerat delectus rem soluta neque illo.",
    createdBy: "teste",
    type: "call",
  }),
  FollowUp.create({
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus, asperiores possimus. Ab, dolorum, aliquid incidunt odit doloribus nulla eum quos, maiores molestiae voluptatum ipsam quaerat delectus rem soluta neque illo.",
    createdBy: "teste",
    type: "email",
  }),
  FollowUp.create({
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus, asperiores possimus. Ab, dolorum, aliquid incidunt odit doloribus nulla eum quos, maiores molestiae voluptatum ipsam quaerat delectus rem soluta neque illo.",
    createdBy: "teste",
    type: "meeting",
  }),
  FollowUp.create({
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus, asperiores possimus. Ab, dolorum, aliquid incidunt odit doloribus nulla eum quos, maiores molestiae voluptatum ipsam quaerat delectus rem soluta neque illo.",
    createdBy: "teste",
    type: "message",
  }),
  FollowUp.create({
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus, asperiores possimus. Ab, dolorum, aliquid incidunt odit doloribus nulla eum quos, maiores molestiae voluptatum ipsam quaerat delectus rem soluta neque illo.",
    createdBy: "teste",
    type: "other",
  })
);

const initialBuckets: Bucket[] = [
  Bucket.create("Novos Leads", "#D3D3D3"),
  Bucket.create("Qualificados", "#3B82F6"),
  Bucket.create("Proposta Enviada", "#8B5CF6"),
  Bucket.create("Negociação", "#10B981"),
  Bucket.create("Fechado", "#EF4444"),
];

export default async function CRMPage() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <Kanban
        initialBuckets={initialBuckets.map((bucket) => bucket.raw())}
        initialCards={initialCards.map((card) => card.raw())}
      />
    </main>
  );
}
