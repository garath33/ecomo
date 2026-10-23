import { describe, expect, it } from "vitest";
import { resolveAnalytics } from "../../src/lib/analytics";

describe("cookie-free analytics", () => {
  it("stays off when nothing is configured", () => {
    expect(resolveAnalytics({ siteEnv: "production" })).toEqual({ provider: "none" });
    expect(resolveAnalytics({})).toEqual({ provider: "none" });
  });

  it("prefers Cloudflare, then Plausible, then Umami", () => {
    expect(
      resolveAnalytics({
        siteEnv: "production",
        cfToken: " cf ",
        plausibleDomain: "ecomo.cz",
        umamiSrc: "https://umami.example/script.js",
        umamiWebsiteId: "site",
      }),
    ).toEqual({ provider: "cloudflare", token: "cf" });

    expect(
      resolveAnalytics({
        siteEnv: "production",
        plausibleDomain: "www.ecomo.cz",
        umamiSrc: "https://umami.example/script.js",
        umamiWebsiteId: "site",
      }),
    ).toEqual({ provider: "plausible", domain: "www.ecomo.cz" });

    expect(
      resolveAnalytics({
        siteEnv: "production",
        umamiSrc: "https://umami.example/script.js",
        umamiWebsiteId: "site",
      }),
    ).toEqual({
      provider: "umami",
      src: "https://umami.example/script.js",
      websiteId: "site",
    });

    expect(
      resolveAnalytics({
        siteEnv: "production",
        umamiSrc: "https://umami.example/script.js",
      }),
    ).toEqual({ provider: "none" });
  });
});
