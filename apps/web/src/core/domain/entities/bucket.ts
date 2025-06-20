export namespace Bucket {
  export interface Props<T = string> {
    id: string;
    position: number;
    name: T;
    color: string;
  }
}

export class Bucket<T extends string = string> {
  public id: string;
  public position: number;
  public name: T;
  public color: string;

  constructor(props: Bucket.Props<T>) {
    this.id = props.id;
    this.position = props.position;
    this.name = props.name;
    this.color = props.color;
  }

  setName(name: T) {
    this.name = name;
  }

  setPosition(position: number) {
    this.position = position;
    return this;
  }

  static instance(props: Bucket.Props) {
    return new Bucket(props);
  }

  raw(): Bucket.Props {
    return {
      id: this.id,
      name: this.name as T,
      position: this.position,
      color: this.color,
    };
  }

  static create(name: string, color?: string, position?: number) {
    return new Bucket({
      color: color ?? "#efefef",
      id: crypto.randomUUID().toString(),
      name,
      position: position ?? 0,
    });
  }
}
