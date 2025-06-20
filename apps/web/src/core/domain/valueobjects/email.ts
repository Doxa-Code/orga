import { FieldInvalid } from "../errors/field-invalid";

export class Email {
  constructor(readonly value: string) {
    if (!this.isValidEmail(value)) {
      throw new FieldInvalid(`Email ${value}`);
    }
    this.value = value;
  }

  public static create(value?: string | null): Email {
    return new Email(value || "");
  }

  private isValidEmail(value: string): boolean {
    if (!value) {
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}
