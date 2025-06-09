import type { User } from "./user";

export namespace Appointment {
  export interface Props {
    id: string;
    description: string;
    createdBy: User;
    scheduledAt: Date;
    createdAt: Date;
  }
  export interface CreateProps {
    description: string;
    createdBy: User;
    scheduledAt: Date;
  }
}

export class Appointment {
  public id: string;
  public description: string;
  public createdBy: User;
  public scheduledAt: Date;
  public createdAt: Date;
  constructor(props: Appointment.Props) {
    this.id = props.id;
    this.description = props.description;
    this.createdBy = props.createdBy;
    this.scheduledAt = props.scheduledAt;
    this.createdAt = props.createdAt;
  }
  static create(props: Appointment.CreateProps) {
    return new Appointment({
      createdAt: new Date(),
      createdBy: props.createdBy,
      description: props.description,
      id: crypto.randomUUID().toString(),
      scheduledAt: props.scheduledAt,
    });
  }
}
