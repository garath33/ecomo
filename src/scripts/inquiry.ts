import { messages } from "../locales";
import {
  validateInquiry,
  submitInquiry,
  readInquiryForm,
  topicLabel,
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

function renderStatus(status: HTMLElement, kind: "pending" | "success" | "error", mailto?: string): void {
  status.hidden = false;
  status.classList.toggle("is-error", kind === "error");
  status.replaceChildren();

  if (kind === "pending") {
    status.textContent = messages.form.sending;
    return;
  }

  if (kind === "success") {
    status.textContent = messages.form.sent;
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

function handOffToProvider(form: HTMLFormElement, input: InquiryInput): void {
  const next = new URL(window.location.href);
  next.hash = "";
  next.searchParams.set("poptavka", "odeslana");

  setHidden(form, "_replyto", input.email.trim());
  setHidden(form, "_next", `${next.origin}${next.pathname}${next.search}#poptavka`);
  setHidden(form, "_subject", `${messages.cta.inquiry} — ${topicLabel(input.topic)}`);
  setHidden(form, messages.form.mailName, input.name.trim());
  setHidden(form, messages.form.mailPhone, input.phone.trim());
  setHidden(form, messages.form.mailEmail, input.email.trim());
  setHidden(form, messages.form.mailTopic, topicLabel(input.topic));
  setHidden(form, messages.form.mailMessage, input.message.trim());

  for (const field of ["name", "phone", "email", "topic", "message"] as const) {
    const control = form.elements.namedItem(field);
    if (control instanceof HTMLElement) control.setAttribute("disabled", "disabled");
  }

  form.dataset.sending = "handoff";
  form.submit();
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
      status.classList.remove("is-error");
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    form.dataset.sending = "true";
    button.disabled = true;
    const label = button.textContent ?? "";
    button.textContent = messages.form.sending;
    renderStatus(status, "pending");

    void submitInquiry(input, site.email)
      .then((result) => {
        if (result.ok) {
          form.reset();
          setErrors(form, {});
          delete form.dataset.lastMailto;
          renderStatus(status, "success");
          status.focus();
          return;
        }

        if (result.reason === "offline") {
          form.dataset.lastMailto = result.mailto;
          renderStatus(status, "error", result.mailto);
          status.focus();
          return;
        }

        if (result.reason === "spam") {
          status.hidden = true;
          return;
        }

        handOffToProvider(form, input);
      })
      .finally(() => {
        if (form.dataset.sending === "handoff") return;
        form.dataset.sending = "false";
        button.disabled = false;
        button.textContent = label;
      });
  });
}

initInquiryForm();
