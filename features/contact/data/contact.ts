import { GithubIcon, Linkedin, Mail } from "lucide-react";

import type { ContactChannel } from "../types/contact";

export const PROFILE_CONTACT = {
  name: "Abdullah Mahmoud",
  email: "abdofwzy9@gmail.com",
  githubUrl: "https://github.com/Abdo5-Mahmoud",
  linkedInUrl: "https://www.linkedin.com/in/abdo-fwzy/",
  // Configurable direct-contact link. No phone number is published; set a
  // full wa.me URL here to enable the WhatsApp channel.
  whatsappUrl: undefined as string | undefined,
} as const;

export const SOCIAL_LINKS = [
  {
    href: PROFILE_CONTACT.githubUrl,
    label: "GitHub profile",
    icon: GithubIcon,
    external: true,
  },
  {
    href: PROFILE_CONTACT.linkedInUrl,
    label: "LinkedIn profile",
    icon: Linkedin,
    external: true,
  },
  {
    href: `mailto:${PROFILE_CONTACT.email}`,
    label: "Send an email",
    icon: Mail,
    external: false,
  },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    description: PROFILE_CONTACT.email,
    href: `mailto:${PROFILE_CONTACT.email}`,
    icon: "mail",
    external: false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Connect professionally",
    href: PROFILE_CONTACT.linkedInUrl,
    icon: "linkedin",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    description: "View my work",
    href: PROFILE_CONTACT.githubUrl,
    icon: "github",
    external: true,
  },
  ...(PROFILE_CONTACT.whatsappUrl
    ? [
        {
          id: "whatsapp",
          label: "WhatsApp",
          description: "Message directly",
          href: PROFILE_CONTACT.whatsappUrl,
          icon: "whatsapp" as const,
          external: true,
        },
      ]
    : []),
];
