import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

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
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
  vite: {
    define: {
      "import.meta.env.PUBLIC_SITE_ENV": JSON.stringify(
        process.env.PUBLIC_SITE_ENV ?? "development",
      ),
      "import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN": JSON.stringify(
        process.env.PUBLIC_CF_ANALYTICS_TOKEN ?? "",
      ),
      "import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN": JSON.stringify(
        process.env.PUBLIC_PLAUSIBLE_DOMAIN ?? "",
      ),
      "import.meta.env.PUBLIC_UMAMI_SRC": JSON.stringify(process.env.PUBLIC_UMAMI_SRC ?? ""),
      "import.meta.env.PUBLIC_UMAMI_WEBSITE_ID": JSON.stringify(
        process.env.PUBLIC_UMAMI_WEBSITE_ID ?? "",
      ),
    },
  },
});
