import type {
  ContactFieldErrors,
  ContactFormValues,
  ContactSubmissionResult,
} from "../types/contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MESSAGE_MAX_LENGTH = 1000;

export function validateContactForm(
  values: ContactFormValues,
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.subject.trim()) {
    errors.subject = "Please enter a subject.";
  }
  const messageLength = values.message.trim().length;
  if (messageLength < 10) {
    errors.message = "Please write a message of at least 10 characters.";
  } else if (messageLength > MESSAGE_MAX_LENGTH) {
    errors.message = `Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`;
  }

  return errors;
}

export async function submitContactMessage(
  values: ContactFormValues,
): Promise<ContactSubmissionResult> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const result = (await response.json()) as ContactSubmissionResult;

  if (!response.ok || !result.ok) {
    throw new Error("Contact submission failed");
  }

  return result;
}
