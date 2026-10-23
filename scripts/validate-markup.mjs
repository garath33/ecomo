import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as csstree from "css-tree";
import { HtmlValidate } from "html-validate";

const htmlvalidate = new HtmlValidate({
  root: true,
  extends: ["html-validate:recommended"],
  rules: {
    // HTML5 treats the doctype as case-insensitive. Astro emits lowercase.
    "doctype-style": "off",
    // The published phone number uses regular spaces. This rule is typography, not invalid HTML.
    "tel-non-breaking": "off",
  },
});

export function cssSyntaxErrors(css, filename) {
  const errors = [];
  try {
    const ast = csstree.parse(css, {
      filename,
      positions: true,
      onParseError(error) {
        const line = error.line ?? 0;
        const column = error.column ?? 0;
        errors.push(`${filename}:${line}:${column} ${error.message}`);
      },
    });
    csstree.walk(ast, (node) => {
      if (node.type !== "Declaration") return;
      const empty = Boolean(node.value?.children?.isEmpty);
      if (empty) {
        const line = node.loc?.start?.line ?? 0;
        const column = node.loc?.start?.column ?? 0;
        errors.push(`${filename}:${line}:${column} ${node.property} has an empty value`);
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`${filename}: ${message}`);
  }
  return errors;
}

export async function htmlErrors(html, filename) {
  const report = await htmlvalidate.validateString(html, filename);
  return report.results.flatMap((result) =>
    result.messages
      .filter((message) => message.severity === 2)
      .map(
        (message) =>
          `${filename}:${message.line}:${message.column} ${message.ruleId} ${message.message}`,
      ),
  );
}

async function validateDist(distDir) {
  const errors = [];
  const files = walk(distDir);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const cssFiles = [
    ...files.filter((file) => file.endsWith(".css")),
    ...walk(path.resolve("src")).filter((file) => file.endsWith(".css")),
  ];

  if (htmlFiles.length === 0) errors.push("no HTML files in the build output");

  for (const file of htmlFiles) {
    errors.push(...(await htmlErrors(fs.readFileSync(file, "utf8"), path.relative(process.cwd(), file))));
  }
  for (const file of cssFiles) {
    errors.push(...cssSyntaxErrors(fs.readFileSync(file, "utf8"), path.relative(process.cwd(), file)));
  }
  return errors;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (invokedDirectly) {
  const distDir = path.resolve("dist");
  if (!fs.existsSync(distDir)) {
    console.error("dist/ is missing. Run npm run build before markup validation.");
    process.exit(1);
  }
  const errors = await validateDist(distDir);
  if (errors.length) {
    console.error(`Markup validation failed (${errors.length}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log("HTML and CSS validation passed");
}
