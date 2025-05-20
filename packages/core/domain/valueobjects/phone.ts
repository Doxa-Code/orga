export class Phone {
  constructor(readonly value: string) {
    this.value = value;
  }

  static create(phone?: string) {
    return new Phone(phone || "");
  }
}
