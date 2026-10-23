import fs from "node:fs";
import path from "node:path";
import messages from "../src/locales/cs.json" with { type: "json" };
import { expectsPreviewBanner } from "./preview-site.mjs";

const distDir = path.resolve(process.argv[2] ?? "dist");
const mode = process.argv[3] ?? "production";
const marker = messages.preview;

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

if (!fs.existsSync(distDir)) {
  console.error(`Missing build output: ${distDir}`);
  process.exit(1);
}

const files = walk(distDir);
if (!files.length) {
  console.error(`No HTML files in ${distDir}`);
  process.exit(1);
}

const failures = [];
for (const file of files) {
  const relativePath = path.relative(distDir, file);
  const html = fs.readFileSync(file, "utf8");
  const hasBanner = html.includes(marker);
  const shouldHaveBanner = expectsPreviewBanner(relativePath, mode);
  if (hasBanner !== shouldHaveBanner) {
    failures.push(
      `${relativePath}: lišta ${hasBanner ? "je" : "není"} v HTML, očekáváno ${shouldHaveBanner ? "je" : "není"}`,
    );
  }
}

if (mode === "split" && !files.some((file) => expectsPreviewBanner(path.relative(distDir, file), mode))) {
  failures.push("V dist/preview chybí HTML náhledu.");
}

if (failures.length) {
  console.error(`Kontrola náhledové lišty selhala (${mode}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Náhledová lišta sedí (${mode}, ${files.length} HTML).`);
