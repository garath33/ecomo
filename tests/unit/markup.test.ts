import { describe, expect, it } from "vitest";
import { cssSyntaxErrors, htmlErrors } from "../../scripts/validate-markup.mjs";

describe("markup validation", () => {
  it("accepts a small valid document and a valid stylesheet", async () => {
    const html = "<!DOCTYPE html><html lang=\"cs\"><head><meta charset=\"utf-8\"><title>Ecomo</title></head><body><p>Ahoj</p></body></html>";
    expect(await htmlErrors(html, "ok.html")).toEqual([]);
    expect(cssSyntaxErrors("body { color: #111; font-family: Sansation, sans-serif; }", "ok.css")).toEqual([]);
  });

  it("reports invalid HTML and invalid CSS", async () => {
    const html = await htmlErrors("<html><p></div>", "bad.html");
    expect(html.length).toBeGreaterThan(0);
    expect(cssSyntaxErrors("body { color: ; }", "bad.css").length).toBeGreaterThan(0);
  });
});
