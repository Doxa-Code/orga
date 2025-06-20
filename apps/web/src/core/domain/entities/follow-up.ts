export namespace FollowUp {
  export type Type = "call" | "email" | "meeting" | "message" | "other";
  export interface Props {
    id: string;
    content: string;
    createdAt: Date;
    createdBy: string;
    type: Type;
  }
  export interface CreateProps {
    content: string;
    type?: Type;
    createdBy: string;
  }

  export interface Raw {
    id: string;
    content: string;
    createdAt: Date;
    createdBy: string;
    type: Type;
  }
}

export class FollowUp {
  public id: string;
  public content: string;
  public createdAt: Date;
  public createdBy: string;
  public type: FollowUp.Type;
  constructor(props: FollowUp.Props) {
    this.id = props.id;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this.type = props.type;
  }

  static instance(props: FollowUp.Raw) {
    return new FollowUp({
      content: props.content,
      createdAt: new Date(props.createdAt),
      createdBy: props.createdBy,
      type: props.type,
      id: props.id,
    });
  }

  raw(): FollowUp.Raw {
    return {
      id: this.id,
      content: this.content,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      type: this.type,
    };
  }

  static create(props: FollowUp.CreateProps) {
    return new FollowUp({
      content: props.content ?? "",
      createdAt: new Date(),
      createdBy: props.createdBy,
      id: crypto.randomUUID().toString(),
      type: props.type ?? "other",
    });
  }
}
