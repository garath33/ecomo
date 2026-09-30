import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL ?? "https://garath33.github.io";
const base = process.env.PUBLIC_BASE_PATH ?? "/ecomo";

export default defineConfig({
  site,
  base,
  compressHTML: true,
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  vite: {
    define: {
      "import.meta.env.PUBLIC_SITE_ENV": JSON.stringify(
        process.env.PUBLIC_SITE_ENV ?? "development",
      ),
    },
  },
});
