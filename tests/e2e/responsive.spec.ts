import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
}

test.describe("responsiveness", () => {
  for (const viewport of viewports) {
    test(`homepage layout holds together at ${viewport.name} ${viewport.width}px`, async ({
      page,
    }, testInfo) => {
      test.skip(
        testInfo.project.name === "mobile" && viewport.name !== "mobile",
        "mobile project already covers the small viewport",
      );
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("./");

      await expect(page.getByTestId("hero")).toBeVisible();
      await expect(page.getByTestId("offer")).toBeVisible();
      await expect(page.getByTestId("projects")).toBeVisible();
      await expect(page.getByTestId("about")).toBeVisible();
      await expect(page.getByTestId("contact")).toBeVisible();
      await expect(page.getByRole("link", { name: "Nezávazná poptávka" }).first()).toBeAttached();
      expect(await hasHorizontalOverflow(page)).toBe(false);
    });
  }

  test("mobile menu opens navigation and the inquiry CTA", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("./");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Hotové zakázky" })).toBeVisible();
    await page.getByRole("navigation").getByRole("link", { name: "Nezávazná poptávka" }).click();
    await expect(page.locator("#poptavka")).toBeInViewport();
  });

  test("service pages do not overflow on a narrow screen", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const path of ["./fotovoltaika/", "./tepelna-cerpadla/"]) {
      await page.goto(path);
      expect(await hasHorizontalOverflow(page)).toBe(false);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByTestId("contact")).toBeVisible();
    }
  });
});
