export type TagRaw = {
  value: string;
  color: string;
};

export class Tag {
  constructor(
    readonly value: string,
    readonly color: string
  ) {}
  static create(value: string, color?: string) {
    return new Tag(value, color ?? "#2687e9");
  }

  raw(): TagRaw {
    return {
      value: this.value,
      color: this.color,
    };
  }
}
