import { inquiryTopics, type InquiryTopic } from "../site.config";

export type InquiryInput = {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  website?: string;
};

export type InquiryErrors = Partial<Record<keyof InquiryInput | "form", string>>;

const topicValues = new Set(inquiryTopics.map((topic) => topic.value));

function compactPhone(value: string): string {
  return value.replace(/[\s().-]/g, "");
}

export function validateInquiry(input: InquiryInput): InquiryErrors {
  const errors: InquiryErrors = {};

  if (input.website?.trim()) {
    errors.form = "Poptávku se nepodařilo odeslat.";
    return errors;
  }

  if (input.name.trim().length < 2) {
    errors.name = "Uveďte prosím jméno a příjmení.";
  }

  const phone = compactPhone(input.phone);
  if (!/^(\+420)?[1-9]\d{8}$/.test(phone)) {
    errors.phone = "Uveďte platné české telefonní číslo.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "Uveďte platný e-mail.";
  }

  if (!topicValues.has(input.topic as InquiryTopic)) {
    errors.topic = "Vyberte, o co máte zájem.";
  }

  if (input.message.trim().length < 10) {
    errors.message = "Napište alespoň krátký popis poptávky.";
  }

  return errors;
}

export function topicLabel(topic: string): string {
  return inquiryTopics.find((item) => item.value === topic)?.label ?? topic;
}

export function buildMailto(input: InquiryInput, to: string): string {
  const subject = encodeURIComponent(`Nezávazná poptávka — ${topicLabel(input.topic)}`);
  const body = encodeURIComponent(
    [
      `Jméno: ${input.name.trim()}`,
      `Telefon: ${input.phone.trim()}`,
      `E-mail: ${input.email.trim()}`,
      `Zájem: ${topicLabel(input.topic)}`,
      "",
      input.message.trim(),
    ].join("\n"),
  );

  return `mailto:${to}?subject=${subject}&body=${body}`;
}

export function readInquiryForm(form: Pick<HTMLFormElement, "elements">): InquiryInput {
  const data = new FormData(form as HTMLFormElement);
  return {
    name: String(data.get("name") ?? ""),
    phone: String(data.get("phone") ?? ""),
    email: String(data.get("email") ?? ""),
    topic: String(data.get("topic") ?? ""),
    message: String(data.get("message") ?? ""),
    website: String(data.get("website") ?? ""),
  };
}
