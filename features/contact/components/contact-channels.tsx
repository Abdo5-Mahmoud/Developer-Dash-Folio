"use client";

import * as React from "react";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ContactChannel } from "../types/contact";

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  whatsapp: MessageCircle,
} as const;

export function ContactChannels({ channels }: { channels: ContactChannel[] }) {
  return (
    <div className="flex flex-col gap-3">
      {channels.map(({ id, label, description, href, icon, external }) => {
        const Icon = ICONS[icon];
        return (
          <Card key={id} className="p-1 transition-colors duration-150 hover:border-border-strong">
            <Button
              asChild
              variant="ghost"
              className="h-auto w-full justify-start gap-3 p-4 text-left"
            >
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                aria-label={
                  external ? `Open ${label} in a new tab` : label
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="flex min-w-0 flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                  <span className="truncate text-xs text-muted-foreground">{description}</span>
                </span>
              </a>
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
