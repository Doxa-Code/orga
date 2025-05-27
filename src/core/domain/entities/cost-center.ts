import { FieldMissing } from "../errors/field-missing";

export namespace CostCenter {
  export interface Props {
    id: string;
    code: string;
    name: string;
    workspaceId: string;
  }
}

export class CostCenter {
  public id: string;
  public code: string;
  public name: string;
  public workspaceId: string;

  constructor(props: CostCenter.Props) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.workspaceId = props.workspaceId;
  }

  static instance(props: CostCenter.Props) {
    return new CostCenter(props);
  }

  static create(name: string, workspaceId: string, code?: string) {
    if (!workspaceId) {
      throw new FieldMissing("workspace ID");
    }

    return new CostCenter({
      code: code || "",
      id: crypto.randomUUID().toString(),
      name,
      workspaceId,
    });
  }
}
