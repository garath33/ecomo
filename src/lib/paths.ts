export function withBase(path = "/"): string {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.replace(/^\//, "");
  return `${normalizedBase}${normalizedPath}`;
}

export function isPreview(): boolean {
  return import.meta.env.PUBLIC_SITE_ENV !== "production";
}
