import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("loads the primary page, its stylesheet, and the Czech document language", async ({ page }) => {
    const response = await page.goto("./");
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("html")).toHaveAttribute("lang", "cs");

    const href = await page.locator('link[rel="stylesheet"]').first().getAttribute("href");
    expect(href).toMatch(/\.css/);
    const css = await page.request.get(href ?? "");
    expect(css.ok()).toBeTruthy();
    expect(await css.text()).toContain("--brand");

    await expect(page.locator("body")).toHaveCSS("font-family", /Sansation/);
    await expect(page.locator(".site-header")).toHaveCSS("background-color", "rgb(216, 231, 22)");
  });
});
