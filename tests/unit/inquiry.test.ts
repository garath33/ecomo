import { afterEach, describe, expect, it, vi } from "vitest";
import { buildMailto, inquiryFormAction, submitInquiry, validateInquiry } from "../../src/lib/inquiry";

const valid = {
  name: "Jan Novák",
  phone: "604 251 324",
  email: "jan@example.cz",
  topic: "fve",
  message: "Rodinný dům u Prahy, zájem o FVE na střechu.",
};

describe("validateInquiry", () => {
  it("accepts a complete Czech inquiry", () => {
    expect(validateInquiry(valid)).toEqual({});
  });

  it("accepts +420 phone numbers", () => {
    expect(validateInquiry({ ...valid, phone: "+420604251324" })).toEqual({});
  });

  it("rejects missing name", () => {
    expect(validateInquiry({ ...valid, name: "A" }).name).toMatch(/jméno/i);
  });

  it("rejects invalid phone", () => {
    expect(validateInquiry({ ...valid, phone: "123" }).phone).toMatch(/telefon/i);
  });

  it("rejects invalid email", () => {
    expect(validateInquiry({ ...valid, email: "nic" }).email).toMatch(/e-mail/i);
  });

  it("rejects unknown topic", () => {
    expect(validateInquiry({ ...valid, topic: "xyz" }).topic).toBeTruthy();
  });

  it("rejects short message", () => {
    expect(validateInquiry({ ...valid, message: "ahoj" }).message).toBeTruthy();
  });

  it("treats filled honeypot as spam", () => {
    expect(validateInquiry({ ...valid, website: "http://spam" }).form).toBeTruthy();
  });
});

describe("buildMailto", () => {
  it("builds a mailto link to the company inbox", () => {
    const href = buildMailto(valid, "jiri.uldrich@ecomo.cz");
    expect(href.startsWith("mailto:jiri.uldrich@ecomo.cz?")).toBe(true);
    expect(decodeURIComponent(href)).toContain("Jan Novák");
    expect(decodeURIComponent(href)).toContain("Instalace fotovoltaiky");
  });
});

describe("inquiryFormAction", () => {
  it("opens the company inbox in the mail client", () => {
    expect(inquiryFormAction("jiri.uldrich@ecomo.cz")).toBe("mailto:jiri.uldrich@ecomo.cz");
  });
});

describe("submitInquiry", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the inquiry to the company inbox", async () => {
    const fetchMock = vi.fn(async () => Response.json({ success: "true" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(submitInquiry(valid, "jiri.uldrich@ecomo.cz")).resolves.toEqual({ ok: true });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://formsubmit.co/ajax/jiri.uldrich@ecomo.cz");
    const body = JSON.parse(String(init.body)) as Record<string, string>;
    expect(body["Jméno"]).toBe("Jan Novák");
    expect(body["Telefon"]).toBe("604 251 324");
    expect(body["Zájem"]).toBe("Instalace fotovoltaiky");
    expect(body["Zpráva"]).toContain("Rodinný dům");
    expect(body._replyto).toBe("jan@example.cz");
    expect(body._honey).toBe("");
    expect(body.website).toBeUndefined();
  });

  it("treats an HTML challenge as a rejection the browser can finish", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<html>challenge</html>", { status: 200, headers: { "Content-Type": "text/html" } })),
    );

    const result = await submitInquiry(valid, "jiri.uldrich@ecomo.cz");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("rejected");
  });

  it("reports a rejection when the service does not accept the inquiry", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>", { status: 403 })));

    const result = await submitInquiry(valid, "jiri.uldrich@ecomo.cz");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("rejected");
      expect(result.mailto.startsWith("mailto:jiri.uldrich@ecomo.cz?")).toBe(true);
    }
  });

  it("reports offline when the browser cannot reach the service", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    const result = await submitInquiry(valid, "jiri.uldrich@ecomo.cz");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("offline");
  });

  it("does not post when the honeypot is filled", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitInquiry({ ...valid, website: "http://spam" }, "jiri.uldrich@ecomo.cz");

    expect(result.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
