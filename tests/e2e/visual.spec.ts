import { expect, test } from "@playwright/test";
import { layoutViewports } from "./viewports";

test.describe("visual regression @visual", () => {
  test.beforeEach(({ browserName: _browserName }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "one baseline per viewport is enough");
  });

  for (const viewport of layoutViewports) {
    test(`homepage at ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("./");
      await page.evaluate(() => document.fonts.ready);
      const shot = await page.screenshot({ fullPage: true, animations: "disabled", caret: "hide" });
      await testInfo.attach(`homepage-${viewport.width}.png`, {
        body: shot,
        contentType: "image/png",
      });
      await expect(page).toHaveScreenshot(`homepage-${viewport.width}.png`, {
        fullPage: true,
        animations: "disabled",
        caret: "hide",
      });
    });
  }
});
