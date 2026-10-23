import { test } from "@playwright/test";
import { layoutViewports } from "./viewports";

test.describe("visual screenshots", () => {
  test.beforeEach(({ browserName: _browserName }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "one screenshot set per viewport is enough for PR review");
  });

  for (const viewport of layoutViewports) {
    test(`homepage at ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("./");
      await page.evaluate(() => document.fonts.ready);
      const file = testInfo.outputPath(`homepage-${viewport.width}.png`);
      await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
      await testInfo.attach(`homepage-${viewport.width}.png`, {
        path: file,
        contentType: "image/png",
      });
    });
  }
});
