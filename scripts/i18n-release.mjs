import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PRIMARY_FILE = "cs.json";

export function localeKeyPaths(value, prefix = "") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) =>
      localeKeyPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

export function checkLocales(localesDir, indexSource) {
  const errors = [];
  if (!fs.existsSync(localesDir)) return [`missing locale directory: ${localesDir}`];

  const files = fs.readdirSync(localesDir).filter((file) => file.endsWith(".json")).sort();
  if (!files.includes(PRIMARY_FILE)) {
    errors.push(`${PRIMARY_FILE} is missing`);
    return errors;
  }

  const primary = JSON.parse(fs.readFileSync(path.join(localesDir, PRIMARY_FILE), "utf8"));
  const primaryKeys = localeKeyPaths(primary).sort();
  if (primary.locale !== "cs" || primary.primary !== true) {
    errors.push("cs.json must stay the primary Czech locale");
  }

  for (const file of files) {
    if (file === PRIMARY_FILE) continue;
    const data = JSON.parse(fs.readFileSync(path.join(localesDir, file), "utf8"));
    if (data.primary === true) errors.push(`${file} must not be marked primary`);
    const keys = localeKeyPaths(data).sort();
    const missing = primaryKeys.filter((key) => !keys.includes(key));
    const extra = keys.filter((key) => !primaryKeys.includes(key));
    if (missing.length) errors.push(`${file} is missing keys: ${missing.join(", ")}`);
    if (extra.length) errors.push(`${file} has keys that are not in cs.json: ${extra.join(", ")}`);
    if (indexSource.includes(file)) {
      errors.push(`src/locales/index.ts imports ${file}; everyday renders stay on cs.json`);
    }
  }

  if (!indexSource.includes("./cs.json")) {
    errors.push("src/locales/index.ts must import ./cs.json");
  }

  return errors;
}

export function releaseSummary(localesDir) {
  const files = fs
    .readdirSync(localesDir)
    .filter((file) => file.endsWith(".json"))
    .sort();
  const secondary = files.filter((file) => file !== PRIMARY_FILE);
  if (secondary.length === 0) {
    return "Primary locale only (cs). Visual coverage of cs is the PR screenshot set. No secondary locale to review.";
  }
  return `Release review for secondary locales: ${secondary.join(", ")}. Compare them with cs.json before shipping. PR pipelines keep testing cs only.`;
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (invokedDirectly) {
  const localesDir = path.resolve("src/locales");
  const indexSource = fs.readFileSync(path.join(localesDir, "index.ts"), "utf8");
  const errors = checkLocales(localesDir, indexSource);
  if (errors.length) {
    console.error(`Locale release check failed (${errors.length}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(releaseSummary(localesDir));
}
