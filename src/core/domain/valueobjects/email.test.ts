import { FieldInvalid } from "../errors/field-invalid";
import { Email } from "./email";

describe("Email Value Object", () => {
  it("should create a valid email", () => {
    let email = Email.create("test@example.com");
    expect(email.value).toBe("test@example.com");
    email = Email.create("contato@orga.com.br");
    expect(email.value).toBe("contato@orgar");
    email = Email.create("");
    expect(email.value).toBe("");
  });

  it("should throw an error for an invalid email", () => {
    expect(() => Email.create("invalid-email")).toThrowError(
      new FieldInvalid("Email invalid-email"),
    );
  });

  it("should accept emails with different domains", () => {
    const email = Email.create("user@domain.co.uk");
    expect(email.value).toBe("user@domain.co.uk");
  });
});
