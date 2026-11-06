import { expect, test, type Page } from "@playwright/test";

async function fillValidInquiry(page: Page): Promise<void> {
  await page.goto("./#poptavka");
  await page.getByLabel("Jméno a příjmení").fill("Marie Svobodová");
  await page.getByLabel("Telefon").fill("604 251 324");
  await page.getByLabel("E-mail").fill("marie@example.cz");
  await page.getByLabel("Mám zájem o").selectOption("both");
  await page.getByLabel("Pár slov o domě a o tom, co chcete řešit").fill(
    "Novostavba u Zdib, zájem o FVE i tepelné čerpadlo.",
  );
}

test.describe("inquiry form @regression", () => {
  test("shows validation errors for an empty submit", async ({ page }) => {
    await page.goto("./#poptavka");
    await page.getByRole("button", { name: "Odeslat poptávku" }).click();
    await expect(page.locator('[data-error-for="name"]')).toContainText("jméno");
    await expect(page.locator('[data-error-for="phone"]')).toContainText("telefon");
    await expect(page.locator('[data-error-for="email"]')).toContainText("e-mail");
  });

  test("sends a valid inquiry to the company inbox", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));

    await fillValidInquiry(page);
    await page.getByRole("button", { name: "Odeslat poptávku" }).click();

    await expect(page.locator("[data-inquiry-status]")).toContainText("E-mail s poptávkou je připravený");
    await expect(page.locator("[data-inquiry-status]")).toContainText("jiri.uldrich@ecomo.cz");
    await expect(page.getByRole("button", { name: "Odeslat poptávku" })).toBeEnabled();
    const href = await page.getByRole("link", { name: "Otevřít e-mailový klient" }).getAttribute("href");
    expect(href).toMatch(/^mailto:jiri\.uldrich@ecomo\.cz\?/);
    expect(decodeURIComponent(href ?? "")).toContain("Marie Svobodová");
    expect(decodeURIComponent(href ?? "")).toContain("Fotovoltaika i tepelné čerpadlo");
    await expect(page.locator("[data-inquiry-form]")).toHaveAttribute("data-last-mailto", href ?? "");
    await expect(page).toHaveURL(/#poptavka/);
    expect(requests.some((url) => url.includes("formsubmit.co"))).toBe(false);
  });

  test("offers the mail client when the browser is offline", async ({ page, context }) => {
    await fillValidInquiry(page);
    await context.setOffline(true);
    await page.getByRole("button", { name: "Odeslat poptávku" }).click();

    await expect(page.locator("[data-inquiry-status]")).toContainText("E-mail s poptávkou je připravený");
    await expect(page.getByRole("link", { name: "Otevřít e-mailový klient" })).toHaveAttribute(
      "href",
      /mailto:jiri\.uldrich@ecomo\.cz/,
    );
    await expect(page.locator("[data-inquiry-form]")).toHaveAttribute(
      "data-last-mailto",
      /mailto:jiri\.uldrich@ecomo\.cz/,
    );
    await expect(page).toHaveURL(/#poptavka/);
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
