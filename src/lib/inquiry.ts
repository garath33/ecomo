import { messages } from "../locales";
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
    errors.form = messages.form.errors.form;
    return errors;
  }

  if (input.name.trim().length < 2) {
    errors.name = messages.form.errors.name;
  }

  const phone = compactPhone(input.phone);
  if (!/^(\+420)?[1-9]\d{8}$/.test(phone)) {
    errors.phone = messages.form.errors.phone;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = messages.form.errors.email;
  }

  if (!topicValues.has(input.topic as InquiryTopic)) {
    errors.topic = messages.form.errors.topic;
  }

  if (input.message.trim().length < 10) {
    errors.message = messages.form.errors.message;
  }

  return errors;
}

export function topicLabel(topic: string): string {
  return inquiryTopics.find((item) => item.value === topic)?.label ?? topic;
}

export function buildMailto(input: InquiryInput, to: string): string {
  const subject = encodeURIComponent(`${messages.cta.inquiry} — ${topicLabel(input.topic)}`);
  const body = encodeURIComponent(
    [
      `${messages.form.mailName}: ${input.name.trim()}`,
      `${messages.form.mailPhone}: ${input.phone.trim()}`,
      `${messages.form.mailEmail}: ${input.email.trim()}`,
      `${messages.form.mailTopic}: ${topicLabel(input.topic)}`,
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
