import type { APIRoute } from "astro";
import { withBase } from "../lib/paths";
import { isIndexableSite, robotsTxt } from "../lib/robots";

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(withBase("sitemap-index.xml"), site ?? "https://www.ecomo.cz");
  const body = robotsTxt({
    indexable: isIndexableSite(site),
    sitemapUrl: sitemap.href,
  });
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
