"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  ContactFieldErrors,
  ContactFormValues,
  ContactSubmissionStatus,
} from "../types/contact";
import {
  MESSAGE_MAX_LENGTH,
  submitContactMessage,
  validateContactForm,
} from "../lib/submit-contact";

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company_url: "",
};

export function ContactForm() {
  const [values, setValues] = React.useState<ContactFormValues>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = React.useState<ContactFieldErrors>({});
  const [status, setStatus] = React.useState<ContactSubmissionStatus>("idle");

  const isSubmitting = status === "submitting";

  function setField<K extends keyof ContactFormValues>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
    if (status === "error") {
      setStatus("idle");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateContactForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus("submitting");
    try {
      await submitContactMessage(values);
      setStatus("success");
      setValues(EMPTY_VALUES);
      setFieldErrors({});
    } catch {
      setStatus("error");
    }
  }

  const describedBy = (key: keyof ContactFormValues) =>
    fieldErrors[key] ? `${key}-error` : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {status === "success" && (
        <div role="status">
          <Callout type="success" title="Message sent">
            Thanks for reaching out — I&apos;ll get back to you soon.
          </Callout>
        </div>
      )}
      {status === "error" && (
        <div role="alert">
          <Callout type="danger" title="Something went wrong">
            Your message could not be sent. Please try again.
          </Callout>
        </div>
      )}

      <Input
        id="contact-company_url"
        name="company_url"
        className="hidden"
        style={{ display: "none" }}
        aria-hidden="true"
        autoComplete="off"
        tabIndex={-1}
        value={values.company_url}
        onChange={(event) => setField("company_url", event.target.value)}
        aria-invalid={Boolean(fieldErrors.company_url)}
        aria-describedby={describedBy("company_url")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={describedBy("name")}
            disabled={isSubmitting}
          />
          {fieldErrors.name && (
            <p id="name-error" className="text-xs text-danger">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={describedBy("email")}
            disabled={isSubmitting}
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-xs text-danger">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          name="subject"
          value={values.subject}
          onChange={(event) => setField("subject", event.target.value)}
          aria-invalid={Boolean(fieldErrors.subject)}
          aria-describedby={describedBy("subject")}
          disabled={isSubmitting}
        />
        {fieldErrors.subject && (
          <p id="subject-error" className="text-xs text-danger">
            {fieldErrors.subject}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={
            [describedBy("message"), "message-hint"]
              .filter(Boolean)
              .join(" ") || undefined
          }
          maxLength={MESSAGE_MAX_LENGTH}
          disabled={isSubmitting}
        />
        <p id="message-hint" className="text-xs text-muted-foreground">
          {values.message.length}/{MESSAGE_MAX_LENGTH} characters
        </p>
        {fieldErrors.message && (
          <p id="message-error" className="text-xs text-danger">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-fit"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
