import { expect, test } from "@playwright/test";

test.describe("homepage @regression", () => {
  test("shows the live sections and a single contact CTA", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByTestId("hero").getByRole("heading", { level: 1 })).toContainText(
      "Smysluplné elektrárny",
    );
    await expect(page.getByTestId("offer")).toContainText("Co nabízíme");
    await expect(page.getByTestId("offer")).toContainText(
      "Firemní instalace — nižší provozní náklady ve výrobě, skladu i kancelářích",
    );
    await expect(page.getByTestId("offer")).not.toContainText("Komerční");
    await expect(page.getByTestId("contact-intro")).toContainText("Ozvěte se nezávazně");
    await expect(page.getByTestId("contact-intro")).toContainText("Neváhejte nás kontaktovat");
    await expect(page.getByTestId("contact-intro")).toContainText("které sedí právě vám");
    await expect(page.getByTestId("contact-intro")).not.toContainText("balíček z ceníku");
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
    await expect(page.getByRole("heading", { name: "Firemní instalace" })).toBeVisible();
    await expect(page.getByText("Energie z vlastní střechy", { exact: false })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Obce a města" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bytové domy a SVJ" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Jak probíhá zakázka" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "1. Kontakt a smlouva" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "2. Administrativa" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "3. Realizace" })).toBeVisible();
    await expect(
      page.getByText("První kontakt, naměření, nacenění, vyhotovení a podpis smlouvy o dílo."),
    ).toBeVisible();
    await expect(
      page.getByText("Instalace, nastavení, předání a revize — v tomhle pořadí."),
    ).toBeVisible();
    const process = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Jak probíhá zakázka" }) });
    const cards = process.locator("article.step");
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0).locator(".step__mark")).toHaveCount(3);
    await expect(cards.nth(1).locator(".step__mark")).toHaveCount(1);
    await expect(cards.nth(2).locator(".step__mark")).toHaveCount(1);

    await page.goto("./");
    await page.getByRole("link", { name: "Více o tepelných čerpadlech" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tepelná čerpadla");
    await expect(page.getByText("Vzduch–voda", { exact: false })).toBeVisible();
    await expect(page.getByText("zhruba třikrát méně elektřiny", { exact: false })).toBeVisible();
  });

  test("offer cards use a panel install photo and the heat-pump photo", async ({ page }) => {
    await page.goto("./");
    const offer = page.getByTestId("offer");
    await expect(offer.getByRole("img", { name: "Montáž černých fotovoltaických panelů na střešní lišty" })).toBeVisible();
    await expect(
      offer.getByRole("img", { name: "Venkovní jednotka tepelného čerpadla u domu" }),
    ).toBeVisible();
    await expect(
      offer.getByRole("img", { name: "Venkovní jednotka tepelného čerpadla u domu" }),
    ).toHaveAttribute("src", /nabidka-tc/);
  });

  test("keeps the inquiry form without repeating footer contacts", async ({ page }) => {
    await page.goto("./");
    const intro = page.getByTestId("contact-intro");
    const form = page.locator("#poptavka");
    const footer = page.getByTestId("site-footer");
    const introBox = await intro.boundingBox();
    const formBox = await form.boundingBox();
    const footerBox = await footer.boundingBox();
    expect(introBox).toBeTruthy();
    expect(formBox).toBeTruthy();
    expect(footerBox).toBeTruthy();
    expect(introBox!.y).toBeLessThan(formBox!.y);
    expect(formBox!.y).toBeLessThan(footerBox!.y);
    await expect(page.getByTestId("contact-details")).toHaveCount(0);
    await expect(intro.getByText("Kontakt", { exact: true })).toHaveCount(0);
    await expect(footer.getByRole("heading", { name: "Kontakt" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Raději zavolat/ })).toHaveCount(0);
    await expect(page.getByTestId("contact")).not.toContainText("Profily na Google");
  });
});
