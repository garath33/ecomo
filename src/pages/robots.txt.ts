import type { APIRoute } from "astro";
import { withBase } from "../lib/paths";

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(withBase("sitemap-index.xml"), site ?? "https://www.ecomo.cz");
  const body = `User-agent: *\nAllow: /\nSitemap: ${sitemap.href}\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
