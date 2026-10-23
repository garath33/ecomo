import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkBuiltSite } from "../../scripts/check-built-site.mjs";

const roots: string[] = [];

function site(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ecomo-smoke-"));
  roots.push(root);
  for (const [name, contents] of Object.entries(files)) {
    const file = path.join(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
  }
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe("post-build smoke", () => {
  it("accepts the primary pages when styles and internal links resolve", () => {
    const root = site({
      "index.html": `<!doctype html><html><head>
        <link rel="stylesheet" href="/ecomo/_astro/site.css">
        </head><body>
        <a href="/ecomo/">Home</a>
        <a href="/ecomo/fotovoltaika/">FV</a>
        <a href="/ecomo/#nabidka">Offer</a>
        <a href="mailto:jiri.uldrich@ecomo.cz">Mail</a>
        <a href="tel:+420604251324">Tel</a>
        <a href="https://www.ecomo.cz">Web</a>
        <section id="nabidka"></section>
        </body></html>`,
      "fotovoltaika/index.html": `<!doctype html><a href="/ecomo/">Back</a><h1 id="title">FV</h1>`,
      "_astro/site.css": "body{font-family:Sansation} :root{--brand:#d8e716}",
    });

    expect(checkBuiltSite(root)).toEqual([]);
  });

  it("stops on a build that has no index.html", () => {
    const root = site({
      "page.html": `<a href="/gone/">Gone</a>`,
    });

    expect(checkBuiltSite(root)).toEqual(["index.html is missing from the build output"]);
  });

  it("fails when index.html links a missing stylesheet or a broken page", () => {
    const root = site({
      "index.html": `<link rel="stylesheet" href="/ecomo/_astro/site.css"><a href="/ecomo/gone/">Gone</a><a href="/ecomo/#missing">X</a>`,
      "fotovoltaika/index.html": "<p>ok</p>",
    });

    const errors = checkBuiltSite(root);
    expect(errors.some((error) => error.includes("stylesheet"))).toBe(true);
    expect(errors.some((error) => error.includes("/ecomo/gone/"))).toBe(true);
    expect(errors.some((error) => error.includes("#missing"))).toBe(true);
  });
});
