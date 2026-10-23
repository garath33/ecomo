export function isPreviewEnv(siteEnv) {
  return siteEnv !== "production";
}

export function expectsPreviewBanner(relativeHtmlPath, mode) {
  const normalized = String(relativeHtmlPath)
    .replaceAll("\\", "/")
    .replace(/^\.\//, "")
    .replace(/^\//, "");
  if (mode === "production") return false;
  if (mode !== "split") throw new Error(`Unknown preview mode: ${mode}`);
  return normalized === "preview" || normalized.startsWith("preview/");
}
