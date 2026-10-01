import { expect, test } from "@playwright/test";

test.describe("inquiry form", () => {
  test("shows validation errors for an empty submit", async ({ page }) => {
    await page.goto("./#poptavka");
    await page.getByRole("button", { name: "Odeslat poptávku" }).click();
    await expect(page.locator('[data-error-for="name"]')).toContainText("jméno");
    await expect(page.locator('[data-error-for="phone"]')).toContainText("telefon");
    await expect(page.locator('[data-error-for="email"]')).toContainText("e-mail");
  });

  test("prepares a mailto link for a valid inquiry", async ({ page }) => {
    await page.goto("./#poptavka");
    await page.getByLabel("Jméno a příjmení").fill("Marie Svobodová");
    await page.getByLabel("Telefon").fill("604 251 324");
    await page.getByLabel("E-mail").fill("marie@example.cz");
    await page.getByLabel("Mám zájem o").selectOption("both");
    await page.getByLabel("Stručně popište dům / poptávku").fill(
      "Novostavba u Zdib, zájem o FVE i tepelné čerpadlo.",
    );

    await page.getByRole("button", { name: "Odeslat poptávku" }).click();

    await expect(page.locator("[data-inquiry-status]")).toBeVisible();
    await expect(page.locator("[data-inquiry-status]")).toContainText("Poptávka je připravená");
    await expect(page.getByRole("link", { name: "Otevřít e-mailový klient" })).toHaveAttribute(
      "href",
      /mailto:jiri\.uldrich@ecomo\.cz/,
    );
  });

  test("keeps the phone in the contact intro, not on the form", async ({ page }) => {
    await page.goto("./#poptavka");
    await expect(page.getByTestId("contact-intro").getByRole("link", { name: "+420 604 251 324" })).toHaveAttribute(
      "href",
      "tel:+420604251324",
    );
    await expect(page.locator("#poptavka").getByRole("link", { name: /Raději zavolat/ })).toHaveCount(0);
  });
});
