import { expect, test } from "@playwright/test";
import { productionFacts, site } from "../../src/site.config";

test.describe("preview matches production content", () => {
  test("contact block publishes the same business facts as ecomo.cz", async ({ page }) => {
    await page.goto("./");
    const contact = page.getByTestId("contact");
    for (const fact of productionFacts) {
      await expect(contact).toContainText(fact);
    }
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
  });

  test("preview banner is extra chrome and does not replace production copy", async ({ page }) => {
    await page.goto("./");
    const banners = page.getByTestId("preview-banner");
    if (await banners.count()) {
      await expect(banners).toHaveCount(1);
    }
    await expect(page.getByTestId("hero")).toContainText("Smysluplné elektrárny");
    await expect(page.getByTestId("offer")).toContainText("Instalace fotovoltaiky");
    await expect(page.getByTestId("projects")).toContainText("Hotové zakázky");
    await expect(page.getByTestId("about")).toContainText(site.about.slice(0, 40));
  });
});
