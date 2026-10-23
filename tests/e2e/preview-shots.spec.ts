import { test } from "@playwright/test";

const shots: Array<{ name: string; path: string; selector?: string }> = [
  { name: "home", path: "./" },
  { name: "fotovoltaika", path: "./fotovoltaika/" },
  { name: "tepelna-cerpadla", path: "./tepelna-cerpadla/" },
  { name: "kontakt", path: "./#kontakt", selector: '[data-testid="contact"]' },
];

test.describe("preview screenshots", () => {
  test.beforeEach(({ page: _page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "desktop shots only");
  });

  for (const shot of shots) {
    test(shot.name, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(shot.path, { waitUntil: "load" });
      const file = `preview-screenshots/${shot.name}.png`;
      if (shot.selector) {
        await page.locator(".site-header").evaluate((header) => {
          header.style.position = "static";
        });
        const target = page.locator(shot.selector);
        await target.scrollIntoViewIfNeeded();
        await target.screenshot({ path: file });
        return;
      }
      await page.screenshot({ path: file, fullPage: true });
    });
  }
});
