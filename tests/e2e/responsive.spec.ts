import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

async function hasHorizontalOverflow(page: Page, selector = "html"): Promise<boolean> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return true;
    return el.scrollWidth > el.clientWidth + 1;
  }, selector);
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
      await expect(page.getByTestId("contact")).toBeVisible();
      await expect(page.getByTestId("projects")).toHaveCount(0);
      await expect(page.getByTestId("about")).toHaveCount(0);
      await expect(page.getByRole("link", { name: "Nezávazná poptávka" }).first()).toBeAttached();
      expect(await hasHorizontalOverflow(page)).toBe(false);
      expect(await hasHorizontalOverflow(page, "header.site-header")).toBe(false);
    });
  }

  test("widths under 1100px use a menu instead of a crushed nav", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("./");
    await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Fotovoltaika" })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Kontakt" })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Hotové zakázky" })).toHaveCount(0);
    await expect(page.getByRole("navigation").getByRole("link", { name: "O nás" })).toHaveCount(0);
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test("mobile menu opens navigation and the inquiry CTA", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("./");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Kontakt" })).toBeVisible();
    await page.getByRole("navigation").getByRole("link", { name: "Nezávazná poptávka" }).click();
    await expect(page.locator("#poptavka")).toBeInViewport();
  });

  test("desktop keeps inline navigation without a menu button", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("./");
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Kontakt" })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Nezávazná poptávka" })).toBeVisible();
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
