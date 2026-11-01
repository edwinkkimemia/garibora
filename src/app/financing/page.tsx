import Link from "next/link";
import { Banknote, ShieldCheck, Calculator, KeyRound, RefreshCcw, FileBadge } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FinanceCalculator } from "@/components/finance/finance-calculator";
import { Button } from "@/components/ui/button";
import { baseMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

export const metadata = baseMetadata({
  title: "Car financing Kenya — loans, SACCOs & calculator",
  description: "Finance your car in Kenya: compare bank, SACCO and dealer rates, estimate monthly payments in KES, and get pre-qualified over WhatsApp.",
  keywords: ["car loan Kenya", "vehicle finance Nairobi", "SACCO car loan", "car loan calculator Kenya", "logbook loan"],
});

const lenders = [
  { name: "Commercial banks", d: "15–20% reducing balance. 20–30% deposit, salaried bias. Best for new & late-model cars.", tag: "Lowest hassle for salaried" },
  { name: "SACCOs", d: "12–15%, flexible on hustle income. Save 3–6 months first; borrow 3–4x deposits.", tag: "Cheapest money" },
  { name: "Dealer in-house", d: "~22% effective, smallest deposit, fastest approval. Read the repossession clause.", tag: "Fastest keys" },
];

export default function FinancingPage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Financing" }]} /></div>
      <section className="bg-navy text-white">
        <div className="container py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Drive now, pay pole pole</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold md:text-5xl">Finance, calculated honestly.</h1>
          <p className="mt-3 max-w-xl text-slate-200">Estimate your monthly payment in seconds, compare lenders, then get pre-qualified over WhatsApp.</p>
        </div>
      </section>
      <div className="container py-8">
        <div className="flex items-center gap-2"><Calculator className="size-5 text-gold-dark" /><h2 className="text-xl font-extrabold">Loan calculator (KES)</h2></div>
        <div className="mt-4"><FinanceCalculator /></div>

        <h2 className="mt-10 text-xl font-extrabold">Where Kenyans borrow</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {lenders.map((l) => (
            <div key={l.name} className="rounded-2xl border bg-card p-5">
              <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-gold-dark">{l.tag}</span>
              <p className="mt-2 flex items-center gap-2 font-bold"><Banknote className="size-4 text-navy" />{l.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l.d}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-extrabold">Need cash against the car you already own?</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { icon: FileBadge, tag: "Same-day cash", t: "Logbook loans", d: "Borrow KSh 100K–3M against your car's logbook and keep driving. 6–24 months, payout to M-Pesa.", wa: "Hi GariBora! I need a logbook loan against my …" },
            { icon: RefreshCcw, tag: "Cut your monthly", t: "Refinance", d: "Already servicing a car loan? Move it for a longer term or better rate and breathe again.", wa: "Hi GariBora! I want to refinance my car loan of KSh …" },
            { icon: KeyRound, tag: "Reserve a car", t: "Deposit & hold", d: "Found your car on GariBora? Place a refundable deposit while bank or SACCO finance is arranged.", wa: "Hi GariBora! I want to reserve the … with a deposit." },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl border bg-card p-5">
              <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-gold-dark">{p.tag}</span>
              <p className="mt-2 flex items-center gap-2 font-bold"><p.icon className="size-4 text-navy" />{p.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
              <a href={whatsappLink(siteConfig.whatsappNumber, p.wa)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#1eb85a] hover:underline"><WhatsAppIcon className="size-4" /> Enquire →</a>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-navy p-6 text-white md:flex-row md:items-center md:p-8">
          <div>
            <p className="flex items-center gap-2 font-extrabold"><ShieldCheck className="size-5 text-gold-light" /> Get pre-qualified in minutes</p>
            <p className="mt-1 text-sm text-slate-300">Send your target car + deposit. A financing partner replies with real terms — free, no obligation.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={whatsappLink(siteConfig.whatsappNumber, "Hi GariBora! I want financing. My budget is KSh … and my deposit is KSh …")} target="_blank" rel="noreferrer"><Button className="bg-[#25D366] text-white hover:bg-[#1eb85a]"><WhatsAppIcon />WhatsApp us</Button></a>
            <Link href="/blog/car-loan-kenya-banks-vs-sacco"><Button className="bg-gold text-navy hover:bg-gold-dark hover:text-white">Loan guide</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
