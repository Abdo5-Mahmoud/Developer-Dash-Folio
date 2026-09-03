export interface ContactChannel {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "whatsapp";
  external: boolean;
}

export type ContactSubmissionStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  company_url: string;
}

export type ContactFieldErrors = Partial<
  Record<keyof ContactFormValues, string>
>;

export interface ContactSubmissionResult {
  ok: boolean;
}
