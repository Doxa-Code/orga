import { Phone } from "./phone";

describe("PhoneNumber Value Object", () => {
  it("should accept phone numbers with symbols and spaces", () => {
    let phoneNumber = Phone.create("11 9 9999-9999");
    expect(phoneNumber.value).toBe("11 9 9999-9999");
    phoneNumber = Phone.create("11 9999-9999");
    expect(phoneNumber.value).toBe("11 9999-9999");
    phoneNumber = Phone.create("");
    expect(phoneNumber.value).toBe("");
  });
});
