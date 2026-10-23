const TEMPORARY_HOST_SUFFIXES = [".github.io", ".pages.dev"] as const;

/** Vlastní doména se indexuje. GitHub Pages a Cloudflare Pages zatím ne. */
export function isIndexableSite(siteUrl: string | URL | undefined): boolean {
  if (!siteUrl) return false;
  const hostname = new URL(siteUrl).hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") return false;
  return !TEMPORARY_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
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
