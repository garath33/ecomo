import { messages } from "../locales";
import { validateInquiry, readInquiryForm, submitInquiry, type InquiryErrors } from "../lib/inquiry";
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

    form.dataset.sending = "true";
    button.disabled = true;
    button.textContent = messages.form.sending;
    renderStatus(status, "pending");

    void submitInquiry(input, site.email).then((result) => {
      form.dataset.sending = "false";
      button.disabled = false;
      button.textContent = messages.form.submit;

      if (result.ok) {
        form.reset();
        renderStatus(status, "success");
        status.focus();
        return;
      }

      form.dataset.lastMailto = result.mailto;
      renderStatus(status, "error", result.mailto);
      status.focus();
    });
  });
}

initInquiryForm();
