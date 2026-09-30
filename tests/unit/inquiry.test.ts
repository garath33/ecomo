import { describe, expect, it } from "vitest";
import { buildMailto, validateInquiry } from "../../src/lib/inquiry";

const valid = {
  name: "Jan Novák",
  phone: "604 251 324",
  email: "jan@example.cz",
  topic: "fve",
  message: "Rodinný dům u Prahy, zájem o FVE na střechu.",
};

describe("validateInquiry", () => {
  it("accepts a complete Czech inquiry", () => {
    expect(validateInquiry(valid)).toEqual({});
  });

  it("accepts +420 phone numbers", () => {
    expect(validateInquiry({ ...valid, phone: "+420604251324" })).toEqual({});
  });

  it("rejects missing name", () => {
    expect(validateInquiry({ ...valid, name: "A" }).name).toMatch(/jméno/i);
  });

  it("rejects invalid phone", () => {
    expect(validateInquiry({ ...valid, phone: "123" }).phone).toMatch(/telefon/i);
  });

  it("rejects invalid email", () => {
    expect(validateInquiry({ ...valid, email: "nic" }).email).toMatch(/e-mail/i);
  });

  it("rejects unknown topic", () => {
    expect(validateInquiry({ ...valid, topic: "xyz" }).topic).toBeTruthy();
  });

  it("rejects short message", () => {
    expect(validateInquiry({ ...valid, message: "ahoj" }).message).toBeTruthy();
  });

  it("treats filled honeypot as spam", () => {
    expect(validateInquiry({ ...valid, website: "http://spam" }).form).toBeTruthy();
  });
});

describe("buildMailto", () => {
  it("builds a mailto link to the company inbox", () => {
    const href = buildMailto(valid, "jiri.uldrich@ecomo.cz");
    expect(href.startsWith("mailto:jiri.uldrich@ecomo.cz?")).toBe(true);
    expect(decodeURIComponent(href)).toContain("Jan Novák");
    expect(decodeURIComponent(href)).toContain("Instalace fotovoltaiky");
  });
});
