import { expect, test } from "@playwright/test";
import { site } from "../../src/site.config";

const pages = [
  { path: "./", title: site.seo.homeTitle, description: site.seo.homeDescription },
  {
    path: "./fotovoltaika/",
    title: site.seo.fotovoltaikaTitle,
    description: site.seo.fotovoltaikaDescription,
  },
  {
    path: "./tepelna-cerpadla/",
    title: site.seo.tepelnaTitle,
    description: site.seo.tepelnaDescription,
  },
  { path: "./o-nas/", title: site.seo.aboutTitle, description: site.seo.aboutDescription },
];

test.describe("seo basics", () => {
  for (const entry of pages) {
    test(`${entry.path} has one h1, meta tags and image alts`, async ({ page }) => {
      await page.goto(entry.path);
      await expect(page).toHaveTitle(entry.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        entry.description,
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", entry.title);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        "content",
        entry.description,
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\//);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\//);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator("img:not([alt]), img[alt='']")).toHaveCount(0);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
      await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute(
        "content",
        /default-src 'self'/,
      );
      await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(2);
    });
  }

  test("lazy-loads offer photos and keeps the hero image eager", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByTestId("hero").locator("img")).toHaveAttribute("loading", "eager");
    await expect(page.getByTestId("hero").locator("img")).toHaveAttribute("fetchpriority", "high");
    await expect(page.getByTestId("hero").locator('source[type="image/avif"]')).toHaveAttribute(
      "srcset",
      /hero-fv-panels\.avif/,
    );
    const offerImages = page.getByTestId("offer").locator("img");
    await expect(offerImages).toHaveCount(2);
    await expect(offerImages.nth(0)).toHaveAttribute("loading", "lazy");
    await expect(offerImages.nth(1)).toHaveAttribute("loading", "lazy");
  });

  test("serves robots.txt and a sitemap without the 404 page", async ({ page }) => {
    const robots = await page.request.get("./robots.txt");
    expect(robots.ok()).toBeTruthy();
    const robotsBody = await robots.text();
    expect(robotsBody).toContain("Disallow: /");
    expect(robotsBody).not.toContain("Sitemap:");

    const sitemap = await page.request.get("./sitemap-index.xml");
    expect(sitemap.ok()).toBeTruthy();
    const index = await sitemap.text();
    expect(index).toContain("sitemap-0.xml");

    const pages = await page.request.get("./sitemap-0.xml");
    expect(pages.ok()).toBeTruthy();
    const body = await pages.text();
    expect(body).toContain("fotovoltaika");
    expect(body).toContain("tepelna-cerpadla");
    expect(body).toContain("o-nas");
    expect(body).not.toContain("/404");
  });

  test("marks a missing page as noindex", async ({ page }) => {
    const response = await page.goto("./tahle-stranka-neexistuje/");
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(site.seo.notFoundTitle);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      site.seo.notFoundDescription,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
});
