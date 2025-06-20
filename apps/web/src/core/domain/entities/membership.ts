import { FieldMissing } from "../errors/field-missing";

export namespace Membership {
  export interface Props {
    id: string;
    isOwner: boolean;
    userId: string;
    workspaceId: string;
  }

  export interface Raw {
    id: string;
    isOwner: boolean;
    userId: string;
    workspaceId: string;
  }
}

export class Membership {
  public id: string;
  public isOwner: boolean;
  public userId: string;
  public workspaceId: string;
  constructor(props: Membership.Props) {
    this.id = props.id;
    this.isOwner = props.isOwner;
    this.userId = props.userId;
    this.workspaceId = props.workspaceId;
  }

  raw(): Membership.Raw {
    return {
      id: this.id,
      isOwner: this.isOwner,
      userId: this.userId,
      workspaceId: this.workspaceId,
    };
  }

  static instance(props: Membership.Props) {
    return new Membership(props);
  }

  static create(userId: string, workspaceId: string, isOwner = false) {
    if (!userId || !workspaceId) {
      throw new FieldMissing("userID or workspaceID");
    }
    return new Membership({
      id: crypto.randomUUID().toString(),
      isOwner,
      userId,
      workspaceId,
    });
  }
}
