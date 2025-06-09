import {
  createBucketDefault,
  listBuckets,
  listProposals,
} from "@/app/actions/crm";
import { CRMKanban } from "@/components/crm/kanban";
import { FollowUp } from "@/core/domain/entities/follow-up";
import { Partner } from "@/core/domain/entities/partner";
import { Proposal } from "@/core/domain/entities/proposal";
import { Tag } from "@/core/domain/valueobjects/tag";

const initialCards: Proposal[] = [
  Proposal.create({
    amount: 15000,
    owner: "user",
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
    owner: "user",
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
    owner: "user",
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

export default async function CRMPage() {
  const [proposals] = await listProposals();
  let [buckets] = await listBuckets();

  if (!buckets?.length) {
    [buckets] = await createBucketDefault();
  }

  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <CRMKanban
        initialBuckets={buckets ?? []}
        initialCards={proposals ?? []}
      />
    </main>
  );
}
