import { FieldMissing } from "../errors/field-missing";
import { Email } from "../valueobjects/email";
import type { Membership } from "./membership";

export namespace User {
  export type Plan = "TRIAL" | "BASIC" | "PREMIUM" | "ENTERPRISE";
  export interface Props {
    id: string;
    name: string;
    email: Email;
    active: boolean;
    createdAt: Date;
    plan: Plan;
    membership: Membership[];
  }
}

export class User {
  public id: string;
  public name: string;
  public email: Email;
  public active: boolean;
  public createdAt: Date;
  public plan: User.Plan;
  public membership: Membership[];

  constructor(props: User.Props) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.active = props.active;
    this.createdAt = props.createdAt;
    this.plan = props.plan;
    this.membership = props.membership;
  }

  turnMember(member: Membership) {
    this.membership.push(member);
  }

  static create(name: string, email: string) {
    if (!email) {
      throw new FieldMissing("email");
    }
    return new User({
      id: crypto.randomUUID().toString(),
      active: true,
      createdAt: new Date(),
      email: Email.create(email),
      name,
      plan: "TRIAL",
      membership: [],
    });
  }
}
