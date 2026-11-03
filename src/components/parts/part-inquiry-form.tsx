"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { siteConfig } from "@/config/site";
import { formatKES, whatsappLink } from "@/lib/utils";

export function PartInquiryForm({ partTitle, price, phone }: { partTitle: string; price: number; phone: string }) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const buyerPhone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const text = [
      `Hi! I'm interested in your part "${partTitle}" listed at ${formatKES(price)} on ${siteConfig.brandName}.`,
      `Name: ${name}`,
      `Phone: ${buyerPhone}`,
      message,
    ].filter(Boolean).join("\n");

    window.open(whatsappLink(phone, text), "_blank", "noopener");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Input name="name" placeholder="Your name" required aria-label="Name" />
      <Input name="phone" placeholder="Phone e.g. 0722000000" required aria-label="Phone" />
      <Textarea
        name="message"
        placeholder="Hi, is this still available? Does it fit a…"
        required
        defaultValue="Is this part still available? Does it fit my car?"
        aria-label="Message"
      />
      <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />Send enquiry</Button>
      <p className="text-xs text-muted-foreground">Opens WhatsApp with your details filled in.</p>
    </form>
  );
}
