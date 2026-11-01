import Link from "next/link";
import { ShieldCheck, FileCheck, CarFront } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { InsuranceEstimator } from "@/components/finance/insurance-estimator";
import { Button } from "@/components/ui/button";
import { baseMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

export const metadata = baseMetadata({
  title: "Car insurance Kenya — instant estimate & cover",
  description: "Estimate comprehensive or third-party car insurance in Kenya in seconds. Compare popular insurers, get covered over WhatsApp.",
  keywords: ["car insurance Kenya", "comprehensive cover cost", "third party insurance price", "motor insurance Nairobi", "insure car Kenya"],
});

const insurers = [
  { name: "Jubilee", d: "Largest motor book in Kenya. Strong garage network, fast windscreen claims." },
  { name: "CIC", d: "Co-operative-backed, competitive comprehensive rates for private cars." },
  { name: "Britam", d: "Flexible add-ons: excess protector, political violence, courtesy car." },
  { name: "APA / Apollo", d: "Popular with dealers for quick cover notes and PSV options." },
];

export default function InsurancePage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Insurance" }]} /></div>
      <section className="bg-navy text-white">
        <div className="container py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Drive legal, drive covered</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold md:text-5xl">Insurance in 60 seconds.</h1>
          <p className="mt-3 max-w-xl text-slate-200">Estimate your premium, pick a popular insurer, and get your cover note over WhatsApp — same day.</p>
        </div>
      </section>
      <div className="container py-8">
        <div className="flex items-center gap-2"><FileCheck className="size-5 text-gold-dark" /><h2 className="text-xl font-extrabold">Premium estimator (KES/year)</h2></div>
        <div className="mt-4"><InsuranceEstimator /></div>

        <h2 className="mt-10 text-xl font-extrabold">Popular insurers Kenyans use</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {insurers.map((l) => (
            <div key={l.name} className="rounded-2xl border bg-card p-5">
              <p className="flex items-center gap-2 font-bold"><CarFront className="size-4 text-navy" />{l.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-navy p-6 text-white md:flex-row md:items-center md:p-8">
          <div>
            <p className="flex items-center gap-2 font-extrabold"><ShieldCheck className="size-5 text-gold-light" /> Get covered today</p>
            <p className="mt-1 text-sm text-slate-300">Send your logbook + ID. A licensed partner issues your sticker and cover note — free quote, no obligation.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={whatsappLink(siteConfig.whatsappNumber, "Hi GariBora! I need insurance. My car is a … valued at KSh …")} target="_blank" rel="noreferrer"><Button className="bg-[#25D366] text-white hover:bg-[#1eb85a]"><WhatsAppIcon />WhatsApp us</Button></a>
            <Link href="/cars"><Button className="bg-gold text-navy hover:bg-gold-dark hover:text-white">Browse cars</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
