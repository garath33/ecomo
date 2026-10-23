import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { robotsMeta, robotsTxt } from "../../src/lib/robots";
import { contentSecurityPolicy, hostingHeadersFile } from "../../src/lib/security";

const root = path.resolve(import.meta.dirname, "../..");

describe("robots.txt", () => {
  it("publishes the sitemap for the public site", () => {
    const production = robotsTxt({
      indexable: true,
      sitemapUrl: "https://garath33.github.io/ecomo/sitemap-index.xml",
    });
    expect(production).toContain("Allow: /");
    expect(production).toContain("Sitemap: https://garath33.github.io/ecomo/sitemap-index.xml");
    expect(robotsTxt({ indexable: false, sitemapUrl: "https://example.test/sitemap.xml" })).toBe(
      "User-agent: *\nDisallow: /\n",
    );
  });

  it("indexes pages and lets a missing page opt out", () => {
    expect(robotsMeta()).toBe("index, follow");
    expect(robotsMeta("noindex, follow")).toBe("noindex, follow");
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
