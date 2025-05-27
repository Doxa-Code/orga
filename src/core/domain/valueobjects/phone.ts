export class Phone {
  constructor(readonly value: string) {
    this.value = value;
  }

  static create(phone?: string | null) {
    return new Phone(phone || "");
  }
}
