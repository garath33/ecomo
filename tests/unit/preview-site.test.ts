import { describe, expect, it } from "vitest";
import { isPreviewEnv } from "../../src/lib/paths";
import { expectsPreviewBanner, isPreviewEnv as isPreviewEnvScript } from "../../scripts/preview-site.mjs";

describe("preview versus production", () => {
  it("shows the banner everywhere except a production build", () => {
    expect(isPreviewEnv("production")).toBe(false);
    expect(isPreviewEnv("preview")).toBe(true);
    expect(isPreviewEnv("development")).toBe(true);
    expect(isPreviewEnv(undefined)).toBe(true);
    expect(isPreviewEnvScript("production")).toBe(false);
    expect(isPreviewEnvScript("preview")).toBe(isPreviewEnv("preview"));
  });

  it("keeps the banner only under dist/preview when both sites ship together", () => {
    expect(expectsPreviewBanner("index.html", "production")).toBe(false);
    expect(expectsPreviewBanner("fotovoltaika/index.html", "production")).toBe(false);
    expect(expectsPreviewBanner("index.html", "split")).toBe(false);
    expect(expectsPreviewBanner("preview/index.html", "split")).toBe(true);
    expect(expectsPreviewBanner("preview/tepelna-cerpadla/index.html", "split")).toBe(true);
  });
});
