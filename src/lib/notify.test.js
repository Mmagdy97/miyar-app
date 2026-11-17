import { describe, it, expect } from "vitest";
import { clientPhone } from "./notify";

describe("clientPhone", () => {
  it("extracts the number of a mobile-login client", () => { expect(clientPhone({ clientEmail: "201005592947@phone.miyarapp.com" })).toBe("201005592947"); });
  it("is empty for email clients", () => { expect(clientPhone({ clientEmail: "a@b.com" })).toBe(""); expect(clientPhone({})).toBe(""); });
});
