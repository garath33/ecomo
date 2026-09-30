import { describe, expect, it } from "vitest";
import { navigation, site } from "../../src/site.config";

describe("site content", () => {
  it("has the contact details from the brief", () => {
    expect(site.person).toBe("Jiří Uldrich");
    expect(site.phoneDisplay).toBe("604 251 324");
    expect(site.phoneTel).toBe("+420604251324");
    expect(site.email).toBe("jiri.uldrich@ecomo.cz");
  });

  it("exposes the requested sections in navigation", () => {
    const labels = navigation.map((item) => item.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        "Co nabízím",
        "Reference",
        "O nás",
        "Kontakt",
        "Fotovoltaika",
        "Tepelná čerpadla",
      ]),
    );
  });
});
