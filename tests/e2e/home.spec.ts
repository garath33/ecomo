import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("shows all requested sections and the inquiry CTA", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByTestId("hero").getByRole("heading", { level: 1 })).toContainText(
      "Smysluplné řešení",
    );
    await expect(page.getByTestId("offer")).toBeVisible();
    await expect(page.getByTestId("references")).toBeVisible();
    await expect(page.getByTestId("about")).toBeVisible();
    await expect(page.getByTestId("contact")).toBeVisible();
    await expect(page.getByTestId("hero").getByRole("link", { name: "Nezávazná poptávka" })).toBeVisible();
    await expect(page.getByTestId("hero").getByRole("link", { name: /Zavolat 604 251 324/ })).toHaveAttribute(
      "href",
      "tel:+420604251324",
    );
  });

  test("navigates from CTA to the inquiry form", async ({ page }) => {
    await page.goto("./");
    await page.getByTestId("hero").getByRole("link", { name: "Nezávazná poptávka" }).click();
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
});
