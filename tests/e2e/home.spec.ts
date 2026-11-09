import { expect, test } from "@playwright/test";

test.describe("homepage @regression", () => {
  test("shows the live sections and a single contact CTA", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByTestId("hero").getByRole("heading", { level: 1 })).toContainText(
      "Osobní přístup k vám i vašemu projektu",
    );
    await expect(page.getByTestId("hero")).not.toContainText("na míru");
    await expect(page.getByTestId("hero")).toContainText("celou zakázku vede Jiří Uldrich");
    await expect(page.getByTestId("offer")).toContainText("Co nabízíme");
    await expect(page.getByTestId("offer")).toContainText(
      "Firemní instalace — nižší provozní náklady ve výrobě, skladu i kancelářích",
    );
    await expect(page.getByTestId("offer")).not.toContainText("Komerční");
    await expect(page.getByTestId("contact-intro")).toContainText("Neváhejte se na nás obrátit");
    await expect(page.getByTestId("contact-intro")).toContainText("Rádi vám pomůžeme");
    await expect(page.getByTestId("contact-intro")).toContainText("Jiří Uldrich s vámi domluví první schůzku");
    await expect(page.getByTestId("contact-intro")).not.toContainText("balíček z ceníku");
    await expect(page.getByTestId("contact")).toBeVisible();
    await expect(page.getByTestId("projects")).toHaveCount(0);
    await expect(page.getByTestId("about")).toHaveCount(0);
    const heroCta = page.getByTestId("hero").getByRole("link", { name: "Kontaktujte nás" });
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveCount(1);
    await expect(page.getByTestId("hero").getByRole("link", { name: /Zavolat/ })).toHaveCount(0);
    await expect(page.getByTestId("hero")).toContainText("Nejdřív vás vyslechneme");
    await expect(page.getByTestId("hero").getByRole("img")).toHaveAttribute(
      "src",
      /hero-fv-panels/,
    );
  });

  test("navigates from CTA to the text above the inquiry form", async ({ page }) => {
    await page.goto("./");
    await page.getByTestId("hero").getByRole("link", { name: "Kontaktujte nás" }).click();
    const heading = page.getByRole("heading", { name: "Neváhejte se na nás obrátit" });
    await expect(heading).toBeInViewport();
    const headingBox = await heading.boundingBox();
    const headerBox = await page.locator("header.site-header").boundingBox();
    expect(headingBox).toBeTruthy();
    expect(headerBox).toBeTruthy();
    expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
    await expect(page.locator("#poptavka")).toBeVisible();
    await expect(page.getByRole("button", { name: "Odeslat poptávku" })).toBeVisible();
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
    const cards = process.locator(".step");
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0).locator(".step__mark")).toHaveCount(1);
    await expect(cards.nth(1).locator(".step__mark")).toHaveCount(1);
    await expect(cards.nth(2).locator(".step__mark")).toHaveCount(1);
    const audiences = page.getByTestId("pv-audiences");
    await expect(audiences.locator("[data-audience]")).toHaveCount(4);
    await expect(audiences.locator("[data-audience='house'] svg")).toBeVisible();
    await expect(audiences.locator("[data-audience='commercial'] svg")).toBeVisible();
    await expect(audiences.locator("[data-audience='town'] svg")).toBeVisible();
    await expect(audiences.locator("[data-audience='apartments'] svg")).toBeVisible();

    await page.goto("./");
    await expect(page.getByTestId("offer")).toContainText("Monoblok vzduch–voda značky Kensol");
    await page.getByRole("link", { name: "Více o tepelných čerpadlech" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tepelná čerpadla");
    await expect(page.getByRole("heading", { name: "Řešení, které instalujeme" })).toBeVisible();
    await expect(page.locator("main")).toContainText("monoblok značky Kensol");
    await expect(page.locator("main")).toContainText("vzduch–voda");
    await expect(page.locator("main")).toContainText("zhruba třikrát méně elektřiny");
    await expect(page.locator("main")).not.toContainText("hydrosplit");
    await expect(page.locator("main")).not.toContainText("split");
    await expect(page.locator("main")).not.toContainText("Necpeme jednu značku");
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
