import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

export function WhatsAppFloat() {
  const href = whatsappLink(siteConfig.whatsappNumber, `Hi ${siteConfig.brandName}! I need help finding a car.`);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-50 grid h-[56px] w-[56px] place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 md:bottom-5 md:right-5"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
