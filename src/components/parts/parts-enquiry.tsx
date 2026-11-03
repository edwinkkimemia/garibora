"use client";

import type { FormEvent } from "react";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

export function PartsEnquiry() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const part = String(data.get("part") ?? "").trim();
    const vehicle = String(data.get("vehicle") ?? "").trim();
    const location = String(data.get("location") ?? "").trim();
    const budget = String(data.get("budget") ?? "").trim();

    const lines = [
      `Hi ${siteConfig.brandName}! I'm looking for a spare part.`,
      `Part needed: ${part}`,
      `Car: ${vehicle}`,
      `Location: ${location}`,
    ];
    if (budget) lines.push(`Budget: ${budget}`);
    lines.push(`Page: ${window.location.href}`);

    window.open(whatsappLink(siteConfig.whatsappNumber, lines.join("\n")), "_blank", "noopener");
  }

  return (
    <section className="mt-12 overflow-hidden rounded-3xl border border-gold/30 bg-navy text-white">
      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        <div className="p-6 md:p-8">
          <span className="grid size-11 place-items-center rounded-xl bg-gold text-navy"><Wrench className="size-5" /></span>
          <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">Enquire about parts</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-200">
            Can&apos;t find what you need? Tell us the part and your car, and we&apos;ll check availability and pricing with trusted sellers.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-slate-200">
            <li>Genuine, used or refurbished options</li>
            <li>Reply with availability and a fixed KES price</li>
            <li>Delivery options countrywide</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-6 text-slate-900 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="enquiry-part">Part needed</Label>
              <Input id="enquiry-part" name="part" required placeholder="e.g. Front brake pads" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="enquiry-vehicle">Car make &amp; model</Label>
              <Input id="enquiry-vehicle" name="vehicle" required placeholder="e.g. Toyota Prado 2018" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="enquiry-location">Location</Label>
              <Select id="enquiry-location" name="location" defaultValue="Nairobi" className="mt-1.5">
                {siteConfig.locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="enquiry-budget">Budget (optional)</Label>
              <Select id="enquiry-budget" name="budget" defaultValue="" className="mt-1.5">
                <option value="">Any budget</option>
                <option value="Under KSh 5,000">Under KSh 5,000</option>
                <option value="KSh 5,000 – 20,000">KSh 5,000 – 20,000</option>
                <option value="KSh 20,000 – 50,000">KSh 20,000 – 50,000</option>
                <option value="Above KSh 50,000">Above KSh 50,000</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-[#25D366] text-white hover:bg-[#1eb85a]">
                <WhatsAppIcon />Send enquiry
              </Button>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Opens WhatsApp with your details filled in. No account needed.</p>
        </form>
      </div>
    </section>
  );
}
