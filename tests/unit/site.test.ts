import { describe, expect, it } from "vitest";
import { navigation, productionFacts, projects, site } from "../../src/site.config";

describe("production content contract", () => {
  it("keeps the business identity from ecomo.cz and the new branding", () => {
    expect(site.legalName).toBe("Ecomo s.r.o.");
    expect(site.person).toBe("Jiří Uldrich");
    expect(site.specialty).toBe("Technologický specialista");
    expect(site.role).toBe("Jednatel");
    expect(site.phoneTel).toBe("+420604251324");
    expect(site.phoneDisplay).toBe("+420 604 251 324");
    expect(site.email).toBe("jiri.uldrich@ecomo.cz");
    expect(site.webDisplay).toBe("www.ecomo.cz");
    expect(site.ico).toBe("21140456");
    expect(site.dic).toBe("CZ21140456");
    expect(site.address.line1).toBe("Polní č.ev. 275");
    expect(site.address.line2).toBe("Přemyšlení");
    expect(site.address.zip).toBe("250 66");
    expect(site.address.city).toBe("Zdiby");
    expect(site.address.district).toBe("Praha-východ");
    expect(site.address.region).toBe("Středočeský kraj");
    expect(site.approach).toMatch(/osobním a lidském přístupu/);
    expect(site.approach).toMatch(/vstříc potřebám na míru/);
  });

  it("exposes every production fact for preview/production parity checks", () => {
    expect(productionFacts.length).toBeGreaterThan(8);
    expect([...productionFacts]).toEqual(expect.arrayContaining([site.ico, site.email, site.person]));
  });

  it("lists the live homepage sections without completed jobs or about", () => {
    const labels = navigation.map((item) => item.label);
    expect(labels).toEqual(["Co nabízím", "Fotovoltaika", "Tepelná čerpadla", "Kontakt"]);
  });

  it("keeps completed-job photos in config for later, off the homepage", () => {
    expect(projects.map((project) => project.image)).toEqual([
      "images/zakazka-pristresek.jpg",
      "images/zakazka-strecha.jpg",
    ]);
  });
});
