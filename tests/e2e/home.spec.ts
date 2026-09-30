import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("shows the live sections and a single contact CTA", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByTestId("hero").getByRole("heading", { level: 1 })).toContainText(
      "Smysluplné elektrárny",
    );
    await expect(page.getByTestId("offer")).toContainText("Co nabízíme");
    await expect(page.getByTestId("contact-bridge")).toContainText("Neváhejte nás kontaktovat");
    await expect(page.getByTestId("contact")).toBeVisible();
    await expect(page.getByTestId("projects")).toHaveCount(0);
    await expect(page.getByTestId("about")).toHaveCount(0);
    const heroCta = page.getByTestId("hero").getByRole("link", { name: "Kontaktujte nás" });
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveCount(1);
    await expect(page.getByTestId("hero").getByRole("link", { name: /Zavolat/ })).toHaveCount(0);
    await expect(page.getByTestId("hero")).toContainText("osobním a lidském přístupu");
    await expect(page.getByTestId("hero").getByRole("img")).toHaveAttribute(
      "src",
      /hero-fv-panels/,
    );
  });

  test("navigates from CTA to the inquiry form", async ({ page }) => {
    await page.goto("./");
    await page.getByTestId("hero").getByRole("link", { name: "Kontaktujte nás" }).click();
    await expect(page.locator("#poptavka")).toBeVisible();
    await expect(page.getByRole("button", { name: "Odeslat poptávku" })).toBeVisible();
    await expect(page.locator("#poptavka")).toBeInViewport();
  });

  test("opens service pages from the offer section", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("link", { name: "Více o fotovoltaice" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fotovoltaika");
    await expect(page.getByRole("heading", { name: "Rodinné domy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Komerční instalace" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Obce a města" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bytové domy a SVJ" })).toBeVisible();

    await page.goto("./");
    await page.getByRole("link", { name: "Více o tepelných čerpadlech" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tepelná čerpadla");
    await expect(page.getByText("Vzduch–voda", { exact: false })).toBeVisible();
  });

  test("offer cards use dark installation photos, not the carport sky shot", async ({ page }) => {
    await page.goto("./");
    const offer = page.getByTestId("offer");
    await expect(offer.getByRole("img", { name: "Montáž černých fotovoltaických panelů na střešní lišty" })).toBeVisible();
    await expect(offer.getByRole("img", { name: "Venkovní jednotka tepelného čerpadla u domu" })).toBeVisible();
  });

  test("stacks contact details above the inquiry form", async ({ page }) => {
    await page.goto("./");
    const list = page.getByTestId("contact").locator(".contact-list");
    const bridge = page.getByTestId("contact-bridge");
    const form = page.locator("#poptavka");
    const listBox = await list.boundingBox();
    const bridgeBox = await bridge.boundingBox();
    const formBox = await form.boundingBox();
    expect(listBox).toBeTruthy();
    expect(bridgeBox).toBeTruthy();
    expect(formBox).toBeTruthy();
    expect(listBox!.y).toBeLessThan(bridgeBox!.y);
    expect(bridgeBox!.y).toBeLessThan(formBox!.y);
  });
});
