import { expect, test, type Page } from "@playwright/test";
import { messages } from "../../src/locales";
import { site } from "../../src/site.config";
import { layoutViewports } from "./viewports";

async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
}

test.describe("contract stamp @regression", () => {
  test("publishes the stamp for electronic contracts and keeps it out of the menu", async ({ page }) => {
    await page.goto("./razitko/");
    await expect(page.getByRole("heading", { level: 1, name: messages.stamp.heading })).toBeVisible();
    await expect(page.getByRole("img", { name: messages.stamp.imageAlt })).toBeVisible();
    const deed = page.getByTestId("stamp-deed");
    await expect(deed).toContainText(messages.stamp.forParty);
    await expect(deed).toContainText(site.person);
    await expect(deed).toContainText(site.role);
    await expect(page.locator("main")).toContainText(site.ico);
    await expect(page.locator("main")).toContainText(site.dic);
    await expect(page.locator("main")).toContainText(site.registry.court);
    await expect(page.locator("main")).toContainText(`vložka ${site.registry.insert}`);

    const svgLink = page.getByRole("link", { name: messages.stamp.downloadSvg });
    const pngLink = page.getByRole("link", { name: messages.stamp.downloadPng });
    const svgHref = await svgLink.getAttribute("href");
    const pngHref = await pngLink.getAttribute("href");
    expect(svgHref).toMatch(/ecomo-razitko\.svg$/);
    expect(pngHref).toMatch(/ecomo-razitko\.png$/);
    expect((await page.request.get(svgHref ?? "")).ok()).toBeTruthy();
    expect((await page.request.get(pngHref ?? "")).ok()).toBeTruthy();

    await expect(page.locator("#hlavni-menu")).not.toContainText(messages.stamp.heading);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test("stamp sheet fits the layout widths", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "mobile project checks the narrow width in the main stamp test");
    for (const viewport of layoutViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("./razitko/");
      await expect(page.getByRole("heading", { level: 1, name: messages.stamp.heading })).toBeVisible();
      expect(await hasHorizontalOverflow(page)).toBe(false);
    }
  });
});
