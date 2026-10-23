export function isIndexable(siteEnv: string | undefined): boolean {
  return siteEnv === "production";
}

export function robotsTxt(options: { indexable: boolean; sitemapUrl: string }): string {
  if (!options.indexable) {
    return "User-agent: *\nDisallow: /\n";
  }

  return `User-agent: *\nAllow: /\nSitemap: ${options.sitemapUrl}\n`;
}

export function robotsMeta(indexable: boolean, requested = "index, follow"): string {
  if (!indexable) return "noindex, nofollow";
  return requested;
}
