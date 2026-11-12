import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { site } from "../../src/site.config";

const svg = fs.readFileSync("public/brand/ecomo-razitko.svg", "utf8");

describe("contract stamp", () => {
  it("prints the company, the seat and the commercial-register entry", () => {
    const desc = svg.match(/<desc[^>]*>([^<]+)<\/desc>/)?.[1] ?? "";
    expect(desc).toContain(site.legalName);
    expect(desc).toContain(site.address.line1);
    expect(desc).toContain(site.address.line2);
    expect(desc).toContain(`${site.address.zip} ${site.address.city}`);
    expect(desc).toContain(site.ico);
    expect(desc).toContain(site.dic);
    expect(desc).toContain(site.registry.court);
    expect(desc).toContain(`oddíl ${site.registry.section}`);
    expect(desc).toContain(`vložka ${site.registry.insert}`);
    expect(svg).toContain('stroke="#D8E716"');
    expect(svg).toContain("M6030");
    expect(svg).toMatch(/width="72mm"/);
    expect(fs.statSync("public/brand/ecomo-razitko.png").size).toBeGreaterThan(1000);
  });
});
