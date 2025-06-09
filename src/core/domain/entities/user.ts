import { FieldMissing } from "../errors/field-missing";
import { Email } from "../valueobjects/email";
import { Membership } from "./membership";

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
  export interface Raw {
    id: string;
    name: string;
    email: string;
    active: boolean;
    createdAt: string;
    plan: Plan;
    membership: Membership.Raw[];
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

  raw(): User.Raw {
    return {
      id: this.id,
      name: this.name,
      email: this.email.value,
      active: this.active,
      createdAt: this.createdAt.toISOString(),
      plan: this.plan,
      membership: this.membership.map((m) => m.raw()),
    };
  }

  static fromRaw(props: User.Raw) {
    return new User({
      email: Email.create(props.email),
      createdAt: new Date(props.createdAt),
      id: props.id,
      name: props.name,
      active: props.active,
      plan: props.plan,
      membership: props.membership.map(Membership.instance),
    });
  }

  turnMember(member: Membership) {
    this.membership.push(member);
  }

  static instance(props: User.Props) {
    return new User(props);
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
