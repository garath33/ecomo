export type Analytics =
  | { provider: "cloudflare"; token: string }
  | { provider: "plausible"; domain: string }
  | { provider: "umami"; src: string; websiteId: string }
  | { provider: "none" };

export interface AnalyticsEnv {
  siteEnv?: string;
  cfToken?: string;
  plausibleDomain?: string;
  umamiSrc?: string;
  umamiWebsiteId?: string;
}

/**
 * Bez cookies. Na ostří se zapne první vyplněná varianta v pořadí
 * Cloudflare → Plausible → Umami. Náhled se neměří.
 */
export function resolveAnalytics(env: AnalyticsEnv): Analytics {
  if (env.siteEnv !== "production") return { provider: "none" };

  const cfToken = env.cfToken?.trim();
  const plausibleDomain = env.plausibleDomain?.trim();
  const umamiSrc = env.umamiSrc?.trim();
  const umamiWebsiteId = env.umamiWebsiteId?.trim();

  if (cfToken) return { provider: "cloudflare", token: cfToken };
  if (plausibleDomain) return { provider: "plausible", domain: plausibleDomain };
  if (umamiSrc && umamiWebsiteId) {
    return { provider: "umami", src: umamiSrc, websiteId: umamiWebsiteId };
  }

  return { provider: "none" };
}
