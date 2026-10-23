export function robotsTxt(options: { indexable: boolean; sitemapUrl: string }): string {
  if (!options.indexable) {
    return "User-agent: *\nDisallow: /\n";
  }

  return `User-agent: *\nAllow: /\nSitemap: ${options.sitemapUrl}\n`;
}

export function robotsMeta(requested = "index, follow"): string {
  return requested;
}
