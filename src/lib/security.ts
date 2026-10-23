export type CspDelivery = "meta" | "header";

const SCRIPT_HOSTS = "https://static.cloudflareinsights.com https://plausible.io";
const CONNECT_HOSTS = "https://cloudflareinsights.com https://plausible.io";

/** CSP pro GitHub Pages (meta) a pro Cloudflare Pages / Netlify (_headers). */
export function contentSecurityPolicy(delivery: CspDelivery): string {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self' mailto:",
    "img-src 'self' data:",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self' 'unsafe-inline' ${SCRIPT_HOSTS}`,
    `connect-src 'self' ${CONNECT_HOSTS}`,
    "upgrade-insecure-requests",
  ];

  if (delivery === "header") {
    directives.push("frame-ancestors 'none'");
  }

  return directives.join("; ");
}

/** Soubor `public/_headers` pro Cloudflare Pages a Netlify. GitHub Pages ho nečte. */
export function hostingHeadersFile(): string {
  const lines = [
    "X-Content-Type-Options: nosniff",
    "Referrer-Policy: strict-origin-when-cross-origin",
    "X-Frame-Options: DENY",
    "Permissions-Policy: camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security: max-age=31536000; includeSubDomains",
    `Content-Security-Policy: ${contentSecurityPolicy("header")}`,
  ];

  return `/*\n${lines.map((line) => `  ${line}`).join("\n")}\n`;
}
