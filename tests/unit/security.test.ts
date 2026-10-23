import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isIndexableSite, robotsMeta, robotsTxt } from "../../src/lib/robots";
import { contentSecurityPolicy, hostingHeadersFile } from "../../src/lib/security";

const root = path.resolve(import.meta.dirname, "../..");

describe("robots.txt", () => {
  it("indexes only the future company domain", () => {
    expect(isIndexableSite("https://www.ecomo.cz/")).toBe(true);
    expect(isIndexableSite("https://ecomo.cz/fotovoltaika/")).toBe(true);
    expect(isIndexableSite("https://garath33.github.io/ecomo/")).toBe(false);
    expect(isIndexableSite("https://ecomo.pages.dev/ecomo/")).toBe(false);
    expect(isIndexableSite("http://127.0.0.1:4321/ecomo/")).toBe(false);

    const production = robotsTxt({
      indexable: true,
      sitemapUrl: "https://www.ecomo.cz/sitemap-index.xml",
    });
    expect(production).toContain("Allow: /");
    expect(production).toContain("Sitemap: https://www.ecomo.cz/sitemap-index.xml");
    expect(robotsTxt({ indexable: false, sitemapUrl: "https://garath33.github.io/ecomo/sitemap-index.xml" })).toBe(
      "User-agent: *\nDisallow: /\n",
    );
  });

  it("hides temporary hosts and lets a missing page opt out on the real domain", () => {
    expect(robotsMeta(false)).toBe("noindex, nofollow");
    expect(robotsMeta(true)).toBe("index, follow");
    expect(robotsMeta(true, "noindex, follow")).toBe("noindex, follow");
  });
});

describe("security headers", () => {
  it("sets nosniff and a self-hosted CSP for the static host", () => {
    const headers = hostingHeadersFile();
    expect(readFileSync(path.join(root, "public/_headers"), "utf8")).toBe(headers);
    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("frame-ancestors 'none'");
    expect(contentSecurityPolicy("meta")).not.toContain("frame-ancestors");
    expect(contentSecurityPolicy("meta")).toContain("default-src 'self'");
    expect(contentSecurityPolicy("meta")).toContain("upgrade-insecure-requests");
  });
});

describe("modern image formats", () => {
  it("ships WebP and AVIF next to every JPEG", () => {
    const dir = path.join(root, "public/images");
    const jpgs = readdirSync(dir).filter((name) => name.endsWith(".jpg"));
    expect(jpgs.length).toBeGreaterThan(0);
    for (const name of jpgs) {
      const stem = name.replace(/\.jpg$/, "");
      expect(readdirSync(dir)).toEqual(expect.arrayContaining([`${stem}.webp`, `${stem}.avif`]));
    }
  });
});
