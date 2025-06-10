import { FieldMissing } from "../errors/field-missing";
import { Tag, TagRaw } from "../valueobjects/tag";
import { FollowUp } from "./follow-up";
import { Partner } from "./partner";

export namespace Proposal {
  export type Source = "referral" | "organic" | "ads" | "outbound" | "other";

  export interface Props {
    id: string;
    title: string;
    description: string;
    partner: Partner;
    owner: string;
    amount: number;
    position: number;
    stage: string;
    source: Source;
    segment: string;
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date | null;
    workspaceId: string;
    followUps: FollowUp[];
  }

  export interface Raw {
    id: string;
    title: string;
    description: string;
    partner: Partner.Raw;
    owner: string;
    amount: number;
    position: number;
    stage: string;
    source: Source;
    segment: string;
    tags: TagRaw[];
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date | null;
    workspaceId: string;
    followUps: FollowUp.Raw[];
  }

  export interface CreateProps {
    title: string;
    partner: Partner;
    owner?: string;
    amount: number;
    workspaceId?: string;
    segment?: string;
    source?: Source;
    tags?: Tag[];
    description?: string;
    stage?: string;
  }
}

export class Proposal {
  public id: string;
  public title: string;
  public description: string;
  public partner: Partner;
  public owner: string;
  private _amount: number;
  public position: number;
  public stage: string;
  public source: Proposal.Source;
  public segment: string;
  private _tags: Map<string, Tag>;
  public createdAt: Date;
  public updatedAt: Date;
  public closedAt: Date | null;
  public workspaceId: string;
  private _followUps: Map<string, FollowUp>;

  constructor(props: Proposal.Props) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.partner = props.partner;
    this.owner = props.owner;
    this.position = props.position;
    this.amount = props.amount;
    this.stage = props.stage;
    this.source = props.source;
    this.segment = props.segment;
    this.tags = props.tags;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.closedAt = props.closedAt;
    this.workspaceId = props.workspaceId;
    this.followUps = props.followUps;
  }

  get amount() {
    return this._amount * 100;
  }

  set amount(amount: number) {
    this._amount = amount / 100;
  }

  get tags() {
    return Array.from(this._tags.values());
  }

  set tags(tags: Tag[]) {
    if (!this._tags) {
      this._tags = new Map<string, Tag>();
    }

    for (const tag of tags) {
      this._tags.set(tag.value, tag);
    }
  }

  get lastFollowUp() {
    return this.followUps
      .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
      .at(0);
  }

  set followUps(followUps: FollowUp[]) {
    if (!this._followUps) {
      this._followUps = new Map<string, FollowUp>();
    }

    for (const followUp of followUps) {
      this._followUps.set(followUp.id, followUp);
    }
  }

  get followUps() {
    return Array.from(this._followUps.values());
  }

  changeStage(stage: string) {
    this.stage = stage;
  }

  setPosition(position: number) {
    this.position = position;
    return this;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setTitle(title: string) {
    this.title = title;
  }

  raw(): Proposal.Raw {
    return {
      id: this.id,
      amount: this.amount,
      closedAt: this.closedAt ?? null,
      createdAt: this.createdAt,
      description: this.description,
      partner: this.partner.raw(),
      owner: this.owner,
      position: this.position,
      followUps: this.followUps.map((f) => f.raw()),
      segment: this.segment,
      source: this.source,
      stage: this.stage,
      tags: this.tags.map((t) => t.raw()),
      title: this.title,
      updatedAt: this.updatedAt,
      workspaceId: this.workspaceId,
    };
  }

  static instance(props: Proposal.Props) {
    return new Proposal(props);
  }

  static fromRaw(props: Proposal.Raw) {
    return new Proposal({
      partner: Partner.fromRaw(props.partner),
      owner: props.owner,
      tags: props.tags.map((t) => Tag.create(t.value, t.color)),
      followUps: props.followUps.map(FollowUp.instance),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
      closedAt: props.closedAt ? new Date(props.closedAt) : null,
      workspaceId: props.workspaceId,
      position: props.position,
      stage: props.stage,
      source: props.source,
      segment: props.segment,
      amount: props.amount,
      description: props.description,
      id: props.id,
      title: props.title,
    });
  }

  static create(props: Proposal.CreateProps) {
    if (!props.title) throw new FieldMissing("title");
    if (!props.partner) throw new FieldMissing("partner");

    const now = new Date();

    return new Proposal({
      id: crypto.randomUUID(),
      title: props.title,
      description: props.description ?? "",
      partner: props.partner,
      owner: props.owner ?? "",
      amount: props.amount ?? 0,
      stage: props.stage ?? "Novos Leads",
      source: props.source ?? "other",
      segment: props.segment ?? "",
      tags: props.tags ?? [],
      createdAt: now,
      updatedAt: now,
      workspaceId: props.workspaceId ?? "",
      followUps: [],
      closedAt: null,
      position: 0,
    });
  }

  addFollowUp(...followUps: FollowUp[]) {
    for (const followUp of followUps) {
      this._followUps.set(followUp.id, followUp);
    }
  }

  setAmount(amount: number) {
    this.amount = amount;
  }

  setStage(stage: string) {
    this.stage = stage;
  }

  addTags(...tags: Tag[]) {
    this.tags = tags;
  }

  clearTag() {
    this._tags.clear();
  }
}
