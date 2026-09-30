import { expect, test } from "@playwright/test";
import { productionFacts, site } from "../../src/site.config";

test.describe("preview matches production content", () => {
  test("contact block publishes the same business facts as ecomo.cz", async ({ page }) => {
    await page.goto("./");
    const contact = page.getByTestId("contact");
    for (const fact of productionFacts) {
      await expect(contact).toContainText(fact);
    }
    await expect(contact.getByRole("link", { name: site.phoneDisplay, exact: true })).toHaveAttribute(
      "href",
      `tel:${site.phoneTel}`,
    );
    await expect(contact.getByRole("link", { name: site.email })).toHaveAttribute(
      "href",
      `mailto:${site.email}`,
    );
    await expect(contact.getByRole("link", { name: site.webDisplay })).toHaveAttribute("href", site.web);
    await expect(contact.getByRole("link", { name: "Google Maps" })).toHaveAttribute("href", site.maps.google);
    await expect(contact.getByRole("link", { name: "Mapy.com" })).toHaveAttribute("href", site.maps.mapy);
  });

  test("footer repeats the same legal identity", async ({ page }) => {
    await page.goto("./");
    const footer = page.locator("footer");
    await expect(footer).toContainText(site.legalName);
    await expect(footer).toContainText(site.ico);
    await expect(footer).toContainText(site.dic);
    await expect(footer).toContainText(site.email);
    await expect(footer).toContainText(site.phoneDisplay);
    await expect(footer).toContainText(site.webDisplay);
    await expect(footer).toContainText(site.address.line1);
    await expect(footer).toContainText(site.address.city);
  });

  test("service pages reuse the same contact facts as the homepage", async ({ page }) => {
    await page.goto("./fotovoltaika/");
    const contact = page.getByTestId("contact");
    for (const fact of productionFacts) {
      await expect(contact).toContainText(fact);
    }
  });

  test("preview banner is extra chrome and does not replace production copy", async ({ page }) => {
    await page.goto("./");
    const banners = page.getByTestId("preview-banner");
    if (await banners.count()) {
      await expect(banners).toHaveCount(1);
    }
    await expect(page.getByTestId("hero")).toContainText("Smysluplné elektrárny");
    await expect(page.getByTestId("hero")).toContainText(site.approach);
    await expect(page.getByTestId("offer")).toContainText("Instalace fotovoltaiky");
    await expect(page.getByTestId("projects")).toHaveCount(0);
    await expect(page.getByTestId("about")).toHaveCount(0);
  });

  test("exposes LocalBusiness JSON-LD and SEO title for crawlers", async ({ page }) => {
    await page.goto("./");
    await expect(page).toHaveTitle(site.seo.homeTitle);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const payload = JSON.parse((await jsonLd.textContent()) ?? "{}") as { name?: string; taxID?: string };
    expect(payload.name).toBe(site.legalName);
    expect(payload.taxID).toBe(site.ico);
  });

  test("section links land below the sticky header", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("./");
    await page.getByRole("navigation").getByRole("link", { name: "Kontakt" }).click();
    const heading = page.getByTestId("contact").locator("h2");
    await expect(heading).toBeInViewport();
    const headingBox = await heading.boundingBox();
    const headerBox = await page.locator("header.site-header").boundingBox();
    expect(headingBox).toBeTruthy();
    expect(headerBox).toBeTruthy();
    expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
  });
});
