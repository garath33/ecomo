import fs from "node:fs";
import path from "node:path";

const SKIP_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

export function checkBuiltSite(distDir) {
  const errors = [];
  if (!fs.existsSync(distDir)) {
    return [`missing build output: ${distDir}`];
  }

  const htmlFiles = walk(distDir).filter((file) => file.endsWith(".html"));
  const indexPath = path.join(distDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    errors.push("index.html is missing from the build output");
    return errors;
  }

  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const basePath = detectBasePath(indexHtml);
  const stylesheets = stylesheetHrefs(indexHtml);
  if (stylesheets.length === 0) {
    errors.push("index.html does not link a stylesheet");
  }

  let branded = false;
  for (const href of stylesheets) {
    const file = resolveLocal(distDir, basePath, indexPath, href);
    if (!file || !isInside(distDir, file) || !fs.existsSync(file)) {
      errors.push(`stylesheet is missing on disk: ${href}`);
      continue;
    }
    const css = fs.readFileSync(file, "utf8");
    if (css.trim().length === 0) {
      errors.push(`stylesheet is empty: ${href}`);
      continue;
    }
    if (css.includes("--brand") || css.includes("font-family")) branded = true;
  }
  if (stylesheets.length > 0 && !branded) {
    errors.push("linked stylesheets do not contain site CSS");
  }

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const href of hrefs(html)) {
      const problem = checkHref(distDir, basePath, file, href);
      if (problem) errors.push(`${path.relative(distDir, file)}: ${problem}`);
    }
  }

  return errors;
}

export function detectBasePath(html) {
  const match = html.match(/href="([^"]*_astro\/[^"]+\.css)"/);
  if (!match) return "";
  const index = match[1].indexOf("/_astro/");
  return index <= 0 ? "" : match[1].slice(0, index);
}

function checkHref(distDir, basePath, fromFile, href) {
  const trimmed = decode(href.trim());
  if (!trimmed) return "empty link";

  const { pathname, hash } = splitHref(trimmed);
  if (pathname.startsWith("//") || SKIP_SCHEME.test(pathname)) return "";

  const target = resolveLocal(distDir, basePath, fromFile, pathname || "./");
  if (!target || !isInside(distDir, target) || !fs.existsSync(target)) {
    return `link does not resolve: ${href}`;
  }
  if (hash && !hasId(fs.readFileSync(target, "utf8"), hash)) {
    return `link target is missing #${hash}: ${href}`;
  }
  return "";
}

function resolveLocal(distDir, basePath, fromFile, rawPath) {
  let local = splitHref(rawPath).pathname;
  if (!local || local.startsWith("//") || SKIP_SCHEME.test(local)) return "";

  if (local.startsWith("/")) {
    if (basePath && (local === basePath || local.startsWith(`${basePath}/`))) {
      local = local.slice(basePath.length) || "/";
    }
    const relative = local.replace(/^\/+/, "");
    if (local.endsWith("/") || relative === "") {
      return path.join(distDir, relative, "index.html");
    }
    const absolute = path.join(distDir, relative);
    return withIndex(absolute);
  }

  const absolute = path.resolve(path.dirname(fromFile), local);
  return withIndex(absolute);
}

function withIndex(absolute) {
  if (absolute.endsWith(path.sep)) return path.join(absolute, "index.html");
  if (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()) {
    return path.join(absolute, "index.html");
  }
  if (!path.extname(absolute) && fs.existsSync(path.join(absolute, "index.html"))) {
    return path.join(absolute, "index.html");
  }
  return absolute;
}

function isInside(distDir, target) {
  const root = path.resolve(distDir);
  const resolved = path.resolve(target);
  return resolved === root || resolved.startsWith(`${root}${path.sep}`);
}

function splitHref(href) {
  const hashAt = href.indexOf("#");
  const queryAt = href.indexOf("?");
  let cut = href.length;
  if (hashAt >= 0) cut = Math.min(cut, hashAt);
  if (queryAt >= 0) cut = Math.min(cut, queryAt);
  let hash = "";
  if (hashAt >= 0) {
    try {
      hash = decodeURIComponent(href.slice(hashAt + 1));
    } catch {
      hash = href.slice(hashAt + 1);
    }
  }
  return { pathname: href.slice(0, cut), hash };
}

function hrefs(html) {
  return [...html.matchAll(/\shref\s*=\s*("([^"]*)"|'([^']*)')/gi)].map((match) => match[2] ?? match[3] ?? "");
}

function stylesheetHrefs(html) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  return tags
    .filter((tag) => /rel\s*=\s*["']stylesheet["']/i.test(tag))
    .map((tag) => tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1] ?? "")
    .filter(Boolean);
}

function hasId(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\sid\\s*=\\s*["']${escaped}["']`, "i").test(html);
}

function decode(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}
