import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { messages } from "../../src/locales";
import { navigation } from "../../src/site.config";
import { checkLocales, localeKeyPaths } from "../../scripts/i18n-release.mjs";

const localesDir = path.resolve("src/locales");
const indexSource = fs.readFileSync(path.join(localesDir, "index.ts"), "utf8");

describe("primary locale", () => {
  it("keeps Czech as the only locale wired into the app", () => {
    expect(messages.locale).toBe("cs");
    expect(messages.primary).toBe(true);
    expect(checkLocales(localesDir, indexSource)).toEqual([]);
    expect(navigation.map((item) => item.label)).toEqual([
      messages.nav.offer,
      messages.nav.pv,
      messages.nav.hp,
      messages.nav.about,
      messages.nav.contact,
    ]);
  });

  it("requires every other locale file to match the primary keys", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ecomo-locales-"));
    try {
      const primary = JSON.parse(fs.readFileSync(path.join(localesDir, "cs.json"), "utf8"));
      fs.writeFileSync(path.join(dir, "cs.json"), JSON.stringify(primary));
      fs.writeFileSync(path.join(dir, "en.json"), JSON.stringify({ locale: "en", primary: false }));
      const index = 'import cs from "./cs.json";\n';

      const errors = checkLocales(dir, index);
      expect(errors.some((error) => error.includes("en.json") && error.includes("missing keys"))).toBe(true);
      expect(localeKeyPaths(primary)).toContain("nav.contact");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
