import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkBuiltSite } from "./check-built-site.mjs";

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (invokedDirectly) {
  const distDir = path.resolve(process.argv[2] ?? "dist");
  if (!fs.existsSync(distDir)) {
    console.error("dist/ is missing. Run npm run build before the smoke check.");
    process.exit(1);
  }
  const errors = checkBuiltSite(distDir);
  if (errors.length) {
    console.error(`Smoke check failed (${errors.length}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Smoke check passed for ${distDir}`);
}
