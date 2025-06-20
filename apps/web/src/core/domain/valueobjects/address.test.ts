import { FieldInvalid } from "../errors/field-invalid";
import { Address } from "./address";

describe("Address Value Object", () => {
  it("valid address", () => {
    expect(
      Address.create(
        "Rua Exemplo",
        "123",
        "Bairro",
        "São Paulo",
        "SP",
        "01234-567",
        "Brasil",
      ),
    ).not.toThrowError(new FieldInvalid("Address"));
    expect(() =>
      Address.create(
        "",
        "123",
        "Bairro",
        "São Paulo",
        "SP",
        "01234-567",
        "Brasil",
      ),
    ).not.toThrowError(new FieldInvalid("Address"));
    expect(() =>
      Address.create(
        "Rua Exemplo",
        "",
        "Bairro",
        "São Paulo",
        "SP",
        "01234-567",
        "Brasil",
      ),
    ).not.toThrowError(new FieldInvalid("Address"));
    expect(() =>
      Address.create(
        "Rua Exemplo",
        "123",
        "Bairro",
        "",
        "SP",
        "01234-567",
        "Brasil",
      ),
    ).not.toThrowError(new FieldInvalid("Address"));
    expect(() =>
      Address.create(
        "Rua Exemplo",
        "123",
        "Bairro",
        "São Paulo",
        "",
        "01234-567",
        "Brasil",
      ),
    ).not.toThrowError(new FieldInvalid("Address"));
    expect(() =>
      Address.create(
        "Rua Exemplo",
        "123",
        "Bairro",
        "São Paulo",
        "SP",
        "",
        "Brasil",
      ),
    ).not.toThrowError(new FieldInvalid("Address"));
    expect(() =>
      Address.create(
        "Rua Exemplo",
        "123",
        "Bairro",
        "São Paulo",
        "SP",
        "01234-567",
        "",
      ),
    ).not.toThrowError(new FieldInvalid("Address"));
  });

  it("invalid address", () => {
    expect(() =>
      Address.create("Rua Exemplo", "123", "S", "SP", "01234-567", "Brasil"),
    ).toThrowError(new FieldInvalid("Address"));
    expect(() =>
      Address.create(
        "Rua Exemplo",
        "123",
        "São Paulo",
        "S",
        "01234-567",
        "Brasil",
      ),
    ).toThrowError(new FieldInvalid("Address"));
    expect(() =>
      Address.create(
        "Rua Exemplo",
        "123",
        "São Paulo",
        "SP",
        "012-567",
        "Brasil",
      ),
    ).toThrowError(new FieldInvalid("Address"));
    expect(() =>
      Address.create("Rua Exemplo", "123", "São Paulo", "SP", "01234-567", "B"),
    ).toThrowError(new FieldInvalid("Address"));
  });
});
