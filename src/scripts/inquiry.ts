import { messages } from "../locales";
import {
  validateInquiry,
  readInquiryForm,
  inquiryHandoffFields,
  buildMailto,
  type InquiryErrors,
  type InquiryInput,
} from "../lib/inquiry";
import { site } from "../site.config";

function setErrors(form: HTMLFormElement, errors: InquiryErrors): void {
  form.querySelectorAll("[data-error-for]").forEach((node) => {
    const field = node.getAttribute("data-error-for");
    node.textContent = field ? (errors[field as keyof InquiryErrors] ?? "") : "";
  });

  for (const field of ["name", "phone", "email", "topic", "message"] as const) {
    const input = form.elements.namedItem(field);
    if (input instanceof HTMLElement) {
      input.setAttribute("aria-invalid", errors[field] ? "true" : "false");
    }
  }
}

function renderStatus(status: HTMLElement, kind: "pending" | "success" | "error" | "check", mailto?: string): void {
  status.hidden = false;
  status.classList.toggle("is-error", kind === "error");
  status.classList.toggle("is-success", kind === "success");
  status.classList.toggle("is-check", kind === "check");
  status.replaceChildren();

  if (kind === "pending") {
    status.textContent = messages.form.sending;
    return;
  }

  if (kind === "success" || kind === "check") {
    const title = document.createElement("p");
    title.className = "form-status__title";
    title.textContent = kind === "success" ? messages.form.sentTitle : messages.form.checkTitle;
    const text = document.createElement("p");
    text.textContent =
      kind === "success"
        ? messages.form.sent
        : `${messages.form.checkBefore}${site.email}${messages.form.checkAfter}`;
    status.append(title, text);
    if (kind === "success") return;
    const mailLink = document.createElement("a");
    mailLink.href = mailto ?? `mailto:${site.email}`;
    mailLink.textContent = messages.form.openMail;
    status.append(mailLink);
    return;
  }

  status.append(messages.form.failed);
  const mailLink = document.createElement("a");
  mailLink.href = mailto ?? `mailto:${site.email}`;
  mailLink.textContent = messages.form.openMail;
  status.append(mailLink);
  status.append(`${messages.form.callPrefix}${site.phoneShort}${messages.form.callSuffix}`);
}

function setHidden(form: HTMLFormElement, name: string, value: string): void {
  const existing = form.querySelector<HTMLInputElement>(`input[type="hidden"][name="${CSS.escape(name)}"]`);
  if (existing) {
    existing.value = value;
    return;
  }
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  form.append(input);
}

const providerWindow = "ecomo-inquiry";

function pageAddress(): string {
  const url = new URL(window.location.href);
  url.hash = "poptavka";
  url.searchParams.delete("poptavka");
  return url.toString();
}

function returnAddress(): string {
  const url = new URL(window.location.href);
  url.hash = "poptavka";
  url.searchParams.set("poptavka", "odeslana");
  return url.toString();
}

function setFieldEnabled(form: HTMLFormElement, enabled: boolean): void {
  for (const field of ["name", "phone", "email", "topic", "message"] as const) {
    const control = form.elements.namedItem(field);
    if (!(control instanceof HTMLElement)) continue;
    if (enabled) control.removeAttribute("disabled");
    else control.setAttribute("disabled", "disabled");
  }
}

/** Běžné odeslání v novém okně. AJAX na FormSubmit neprojde přes kontrolu Cloudflare a stránka by zůstala na „Odesílám…“. */
function postToProvider(form: HTMLFormElement, input: InquiryInput): boolean {
  const popup = window.open("about:blank", providerWindow);
  if (!popup || popup.closed) return false;

  for (const [name, value] of Object.entries(inquiryHandoffFields(input, pageAddress(), returnAddress()))) {
    setHidden(form, name, value);
  }

  form.target = providerWindow;
  setFieldEnabled(form, false);
  form.submit();
  setFieldEnabled(form, true);
  return true;
}

export function initInquiryForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-inquiry-form]");
  const status = document.querySelector<HTMLElement>("[data-inquiry-status]");
  const button = form?.querySelector<HTMLButtonElement>("button[type='submit']");
  if (!form || !status || !button) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("poptavka") === "odeslana") {
    renderStatus(status, "success");
    params.delete("poptavka");
    const query = params.toString();
    history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}#poptavka`);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.dataset.sending === "true") return;

    const input = readInquiryForm(form);
    const errors = validateInquiry(input);
    setErrors(form, errors);

    if (Object.keys(errors).length > 0) {
      status.hidden = true;
      status.classList.remove("is-error", "is-success", "is-check");
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    const mailto = buildMailto(input, site.email);
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      form.dataset.lastMailto = mailto;
      renderStatus(status, "error", mailto);
      status.focus();
      return;
    }

    form.dataset.sending = "true";
    const opened = postToProvider(form, input);
    form.dataset.sending = "false";
    button.disabled = false;

    if (!opened) {
      form.dataset.lastMailto = mailto;
      renderStatus(status, "error", mailto);
      status.focus();
      return;
    }

    form.dataset.lastMailto = mailto;
    renderStatus(status, "check", mailto);
    status.focus();
  });

  window.addEventListener("pageshow", () => {
    form.dataset.sending = "false";
    button.disabled = false;
    if (button.textContent === messages.form.sending) button.textContent = messages.form.submit;
    setFieldEnabled(form, true);
  });
}

initInquiryForm();
