import { validateInquiry, buildMailto, readInquiryForm, type InquiryErrors } from "../lib/inquiry";
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

export function initInquiryForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-inquiry-form]");
  const status = document.querySelector<HTMLElement>("[data-inquiry-status]");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = readInquiryForm(form);
    const errors = validateInquiry(input);
    setErrors(form, errors);

    if (Object.keys(errors).length > 0) {
      status.hidden = true;
      const firstInvalid = form.querySelector<HTMLElement>("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }

    const mailto = buildMailto(input, site.email);
    form.dataset.lastMailto = mailto;
    status.hidden = false;
    status.replaceChildren();
    status.append("Poptávka je připravená. ");
    const mailLink = document.createElement("a");
    mailLink.href = mailto;
    mailLink.textContent = "Otevřít e-mailový klient";
    status.append(mailLink);
    status.append(" nebo zavolejte na 604 251 324.");
  });
}

initInquiryForm();
