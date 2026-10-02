import { expect, test } from "@playwright/test";

test.describe("about page", () => {
  test("is reachable only from the header and stays off the homepage", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByTestId("about")).toHaveCount(0);
    await expect(page.getByTestId("site-footer").getByRole("link", { name: "O nás" })).toHaveCount(0);

    const menu = page.getByRole("button", { name: "Menu" });
    if (await menu.isVisible()) {
      await menu.click();
    }
    await page.getByRole("navigation").getByRole("link", { name: "O nás" }).click();
    await expect(page).toHaveURL(/\/o-nas\/$/);
    await expect(page.getByTestId("about").getByRole("heading", { level: 1 })).toContainText(
      "Lidský přístup a znalost od A do Z",
    );
    await expect(page.getByTestId("about")).toContainText("Jiří Uldrich");
    await expect(page.getByTestId("about")).toContainText("osobním a lidském přístupu");
    await expect(page.getByTestId("about")).toContainText("technologii i řemeslo");
    await expect(page.getByTestId("about")).toContainText("montáž");
  });

  test("does not overflow on a narrow screen", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("./o-nas/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
