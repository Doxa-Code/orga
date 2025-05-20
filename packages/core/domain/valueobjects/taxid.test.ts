import { FieldInvalid } from "../errors/field-invalid";
import { TaxId } from "./taxid";

test("validation", () => {
  expect(() => TaxId.create("")).not.toThrowError(new FieldInvalid("Tax ID"));
  expect(() => TaxId.create("19231")).toThrowError(new FieldInvalid("Tax ID"));
  expect(() => TaxId.create("DSFAD")).toThrowError(new FieldInvalid("Tax ID"));
  expect(() => TaxId.create("149.793.640-39")).not.toThrowError(
    new FieldInvalid("Tax ID"),
  );
  expect(() => TaxId.create("74.525.250/0001-81")).not.toThrowError(
    new FieldInvalid("Tax ID"),
  );
  expect(() => TaxId.create("74525250000181")).not.toThrowError(
    new FieldInvalid("Tax ID"),
  );
  expect(() => TaxId.create("14979364039")).not.toThrowError(
    new FieldInvalid("Tax ID"),
  );
  expect(TaxId.create("149.793.640-39").value).toBe("149.793.640-39");
});
