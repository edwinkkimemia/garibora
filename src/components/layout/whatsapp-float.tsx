"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

const messages: Array<[RegExp, string]> = [
  [/^\/rentals/, "Hi Motiva! I want to hire a car."],
  [/^\/parts/, "Hi Motiva! I'm looking for a spare part."],
  [/^\/financing/, "Hi Motiva! I need financing for a car."],
  [/^\/insurance/, "Hi Motiva! I need insurance for my car."],
  [/^\/sell/, "Hi Motiva! Help me list my car/part."],
  [/^\/dealers/, "Hi Motiva! I'm looking for a trusted dealer."],
  [/^\/blog/, "Hi Motiva! I have a question about your guide."],
  [/^\/cars/, "Hi Motiva! I'm interested in a car on your site."],
  [/^\/(dashboard|profile|favorites)/, "Hi Motiva! I need help with my account."],
  [/^\/contact/, "Hi Motiva! I'd like to talk to someone."],
];

/** Floating WhatsApp button with a page-specific prefilled message. */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const base =
    messages.find(([re]) => re.test(pathname ?? ""))?.[1] ??
    "Hi Motiva! I need help finding a car.";

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = `${base} (Page: ${window.location.href})`;
    window.open(whatsappLink(siteConfig.whatsappNumber, text), "_blank", "noopener");
  };

  return (
    <a
      href="#whatsapp"
      onClick={onClick}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-50 grid h-[56px] w-[56px] place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 md:bottom-5 md:right-5"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
