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
    let body: Record<string, string> | undefined;
    await page.route(
      (url) => url.hostname === "formsubmit.co",
      async (route) => {
        body = route.request().postDataJSON() as Record<string, string>;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: "true" }),
        });
      },
    );

    await fillValidInquiry(page);
    await page.getByRole("button", { name: "Odeslat poptávku" }).click();

    await expect(page.locator("[data-inquiry-status]")).toBeVisible();
    await expect(page.locator("[data-inquiry-status]")).toContainText("Děkujeme za poptávku");
    await expect(page.locator("[data-inquiry-status]")).toContainText("Zpráva se odeslala");
    await expect(page.getByRole("link", { name: "Otevřít e-mailový klient" })).toHaveCount(0);
    expect(body?.["Jméno"]).toBe("Marie Svobodová");
    expect(body?.["Zájem"]).toBe("Fotovoltaika i tepelné čerpadlo");
    expect(body?._replyto).toBe("marie@example.cz");
    expect(body?._honey).toBe("");
  });

  test("posts the form in the browser when the direct request is rejected", async ({ page }) => {
    let posted: URLSearchParams | undefined;
    await page.route((url) => url.hostname === "formsubmit.co", async (route) => {
      if (route.request().resourceType() === "document") {
        posted = new URLSearchParams(route.request().postData() ?? "");
        const next = posted.get("_next") ?? "./";
        await route.fulfill({ status: 303, headers: { location: next } });
        return;
      }
      await route.fulfill({ status: 403, contentType: "text/html", body: "<html>challenge</html>" });
    });

    await fillValidInquiry(page);
    await page.getByRole("button", { name: "Odeslat poptávku" }).click();

    await expect(page.locator("[data-inquiry-status]")).toContainText("Děkujeme za poptávku");
    await expect(page.locator("[data-inquiry-status]")).toContainText("Zpráva se odeslala");
    expect(posted?.get("Jméno")).toBe("Marie Svobodová");
    expect(posted?.get("Zájem")).toBe("Fotovoltaika i tepelné čerpadlo");
    expect(posted?.get("_replyto")).toBe("marie@example.cz");
    expect(posted?.get("_honey") ?? "").toBe("");
    expect(posted?.get("name")).toBeNull();
  });

  test("offers the mail client when the browser is offline", async ({ page, context }) => {
    await fillValidInquiry(page);
    await context.setOffline(true);
    await page.getByRole("button", { name: "Odeslat poptávku" }).click();

    await expect(page.locator("[data-inquiry-status]")).toContainText("nepodařilo odeslat");
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
