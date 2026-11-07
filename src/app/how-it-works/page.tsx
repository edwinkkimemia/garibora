import Link from "next/link";
import { Search, ClipboardCheck, KeyRound, BadgeCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "How it works — buy & sell cars safely in Kenya",
  description: "Search verified cars, chat on WhatsApp, inspect with NTSA checks, pay and transfer. Selling is free. Motiva Kenya guide.",
};

const steps = [
  { icon: Search, t: "1. Search & compare", d: "Filter 118+ verified cars by make, price in KES, year, mileage, fuel and town. Save favourites to compare. Popular picks: Prado, Hilux, Note e-Power, CX-5." },
  { icon: WhatsAppIcon, t: "2. Chat on WhatsApp", d: "Message the seller directly from any listing. Ask for the logbook photo, duty receipt and a cold-start video before you travel." },
  { icon: ClipboardCheck, t: "3. Inspect & verify", d: "View in daylight, test-drive, and confirm the logbook on NTSA TIMS. Verified-badge cars have already passed our duty and condition review." },
  { icon: KeyRound, t: "4. Pay & transfer", d: "Pay the logbook owner via bank or M-Pesa and complete the NTSA transfer together, same day. Never pay before viewing." },
];

const faqs = [
  { q: "Is Motiva free for buyers?", a: "Yes — searching, saving favourites and contacting sellers is completely free. We may introduce optional escrow and inspection services later." },
  { q: "How much does it cost to sell?", a: "Basic listings are free. Optional featured placement to boost visibility will be priced in KES before checkout." },
  { q: "What does the Verified badge mean?", a: "The dealer passed ID and yard-location checks, and the car's duty status, mileage evidence and condition were reviewed by our team." },
  { q: "Can I buy from outside Nairobi?", a: "Yes — dealers in Mombasa, Kisumu, Nakuru, Eldoret and more list here. Always view the car (or send a trusted inspector) before paying." },
  { q: "How do payments work?", a: "You pay the seller directly — bank transfer or M-Pesa to the logbook owner — and transfer ownership on NTSA TIMS together. Escrow is on our roadmap." },
  { q: "What if a car has problems after purchase?", a: "The sale contract is between buyer and seller, but verified dealers agree to a fair-issue resolution process. Report problems via the contact page with your inquiry reference." },
];

export default function HowItWorksPage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "How it works" }]} /></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />

      <section className="bg-navy text-white">
        <div className="container py-14 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Simple & safe</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold md:text-5xl">From search to keys in 4 steps.</h1>
          <p className="mt-3 max-w-xl text-slate-200">The Kenyan way to buy a car — on your phone, over WhatsApp, with verification at every step.</p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="relative rounded-2xl border bg-card p-5">
              <span className="absolute right-4 top-4 text-4xl font-extrabold text-gold/25">0{i + 1}</span>
              <span className="grid size-11 place-items-center rounded-xl bg-navy text-gold-light"><s.icon className="size-5" /></span>
              <p className="mt-3 font-bold">{s.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/cars"><Button size="lg">Browse cars</Button></Link>
          <Link href="/sell"><Button size="lg" variant="outline">Sell your car — free</Button></Link>
        </div>
      </section>

      <section className="bg-muted/50 py-12">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2"><BadgeCheck className="size-5 text-gold-dark" /><h2 className="text-2xl font-extrabold">Questions, answered</h2></div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border bg-card p-5">
                <p className="font-bold">{f.q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">Still stuck? <Link href="/contact" className="font-semibold text-gold-dark hover:underline">Talk to us</Link> — real humans in Nairobi, {siteConfig.whatsappNumber}.</p>
        </div>
      </section>
    </div>
  );
}
