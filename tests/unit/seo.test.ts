import { describe, expect, it } from "vitest";
import { localBusinessJsonLd } from "../../src/lib/local-business";
import { site } from "../../src/site.config";

describe("local business SEO payload", () => {
  const data = localBusinessJsonLd({
    pageUrl: "https://www.ecomo.cz/",
    image: "https://www.ecomo.cz/images/zakazka-pristresek.jpg",
  });

  it("identifies the company with production NAP facts", () => {
    expect(data["@type"]).toBe("LocalBusiness");
    expect(data.name).toBe(site.legalName);
    expect(data.telephone).toBe(site.phoneTel);
    expect(data.email).toBe(site.email);
    expect(data.taxID).toBe(site.ico);
    expect(data.vatID).toBe(site.dic);
    expect(data.address.addressLocality).toBe("Zdiby");
    expect(data.address.addressRegion).toBe("Středočeský kraj");
  });

  it("points maps crawlers at Google and the registered coordinates", () => {
    expect(data.hasMap).toContain("google.com/maps");
    expect(data.geo.latitude).toBeCloseTo(50.164968, 5);
    expect(data.geo.longitude).toBeCloseTo(14.419141, 5);
  });
});

describe("maps and SEO copy stay in one config", () => {
  it("opens the seat in Google Maps and Mapy.com", () => {
    expect(site.maps.google).toContain("google.com/maps");
    expect(site.maps.google).toContain("Zdiby");
    expect(site.maps.mapy).toContain("mapy.com");
    expect(site.maps.mapy).toContain("Zdiby");
  });

  it("keeps Czech title tags with locality for the homepage", () => {
    expect(site.seo.homeTitle).toMatch(/Fotovoltaika/);
    expect(site.seo.homeTitle).toMatch(/Zdiby/);
    expect(site.seo.homeDescription).toMatch(/tepelná čerpadla/i);
  });
});
