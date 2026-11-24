"use client";

import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/site/whatsapp-icon";
import { openWhatsappPanel } from "@/components/site/whatsapp-widget";

export function HeroWhatsappButton({ label, variant = "glass" }: { label: string; variant?: "glass" | "whatsapp" }) {
  return (
    <Button type="button" variant={variant} size="xl" onClick={() => openWhatsappPanel()}>
      <WhatsappIcon />
      {label}
    </Button>
  );
}
