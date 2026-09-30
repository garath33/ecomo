import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("shows all requested sections and the inquiry CTA", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByTestId("hero").getByRole("heading", { level: 1 })).toContainText(
      "Smysluplné elektrárny",
    );
    await expect(page.getByTestId("offer")).toBeVisible();
    await expect(page.getByTestId("projects")).toBeVisible();
    await expect(page.getByTestId("about")).toBeVisible();
    await expect(page.getByTestId("contact")).toBeVisible();
    const heroCta = page.getByTestId("hero").getByRole("link", { name: "Kontaktujte nás" });
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveCount(1);
    await expect(page.getByTestId("hero").getByRole("link", { name: /Zavolat/ })).toHaveCount(0);
    await expect(page.getByTestId("hero")).toContainText("osobním a lidském přístupu");
    await expect(page.getByTestId("about")).toContainText("vstříc potřebám na míru");
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

  test("shows completed jobs with real photos", async ({ page }) => {
    await page.goto("./");
    const projects = page.getByTestId("projects");
    await expect(projects.getByRole("heading", { name: "Fotovoltaický přístřešek" })).toBeVisible();
    await expect(projects.getByRole("heading", { name: "Montáž panelů na střechu" })).toBeVisible();
    await expect(projects.getByRole("img", { name: "Fotovoltaický přístřešek na ocelové konstrukci" })).toBeVisible();
    await expect(projects.getByRole("img", { name: "Detail montáže fotovoltaických panelů na střeše" })).toBeVisible();
  });
});
