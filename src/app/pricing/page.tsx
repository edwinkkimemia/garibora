import Link from "next/link";
import { Zap, Store, Check, MessageCircle, Crown } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { baseMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

export const metadata = baseMetadata({
  title: "Pricing — featured listings & dealer plans",
  description: "How featuring works on Motiva: KSh 999 boosts, dealer plans from KSh 4,999/mo. Pay via M-Pesa, active in minutes.",
  keywords: ["motiva pricing", "feature car listing Kenya", "dealer plans Kenya", "promote car sale"],
});

const boosts = [
  { icon: Zap, name: "Featured — 7 days", price: "KSh 999", d: "Gold badge + top of search, homepage rail and category pages for a full week.", wa: "Hi Motiva! I want the Featured 7-day boost (KSh 999) for my car: …" },
  { icon: MessageCircle, name: "Top slot — 3 days", price: "KSh 499", d: "Pinned to the top of search results in your town for 72 hours.", wa: "Hi Motiva! I want the Top-slot 3-day boost (KSh 499) for my car: …" },
];

const plans = [
  {
    icon: Store, name: "Starter", price: "Free", per: "forever", tag: "For casual sellers",
    features: ["5 active listings", "WhatsApp inquiries", "Basic views stats", "Community support"],
    wa: "Hi Motiva! I'm starting with the free plan.", hot: false,
  },
  {
    icon: Crown, name: "Dealer Growth", price: "KSh 4,999", per: "/month", tag: "For active yards",
    features: ["50 active listings", "Verified yard badge", "1 free Featured boost / month", "Priority WhatsApp support", "Sold + inquiry analytics"],
    wa: "Hi Motiva! I want the Dealer Growth plan (KSh 4,999/mo). My yard is …",
    hot: true,
  },
  {
    icon: Store, name: "Dealer Premium", price: "KSh 9,999", per: "/month", tag: "For top dealers",
    features: ["Unlimited listings", "Homepage dealer spotlight", "4 free Featured boosts / month", "Dedicated account manager", "First access to new features"],
    wa: "Hi Motiva! I want Dealer Premium (KSh 9,999/mo). My yard is …",
    hot: false,
  },
];

const steps = [
  ["Pick a boost or plan", "Tap WhatsApp on any option — your message arrives pre-filled with what you want."],
  ["Pay via M-Pesa", "Buy Goods Till No. 567890 (Motiva Ltd). Send the M-Pesa code back in chat."],
  ["Live in minutes", "We verify payment and flip the switch — badge, top placement and all. You get a confirmation with the expiry date."],
];

const faqs = [
  { q: "How do featured cars get picked?", t: "Two ways: sellers buy a boost (gold Featured badge, top placement for 7 days), or our team hand-picks exceptional verified stock as staff picks (no charge)." },
  { q: "Where do featured cars appear?", t: "Top of search results, the homepage Featured rail, category pages and blog sidebars — anywhere buyers look first." },
  { q: "Do dealers pay to list?", t: "Listing is free up to 5 cars. Yards doing volume take Growth or Premium for more slots, the verified badge and monthly boosts." },
  { q: "What happens when a boost expires?", t: "The car stays live as a normal listing — only the badge and top placement end. Renew anytime from your dashboard." },
  { q: "Is there commission on sales?", t: "No. You keep 100% of the sale price — you only ever pay for visibility." },
];

export default function PricingPage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Pricing" }]} /></div>
      <section className="bg-navy text-white">
        <div className="container py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">No commission. Ever.</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold md:text-5xl">Pay for visibility, keep the whole sale.</h1>
          <p className="mt-3 max-w-xl text-slate-200">Listing is free. When you want to sell faster, boost a car or take a dealer plan — activated over M-Pesa in minutes.</p>
        </div>
      </section>

      <div className="container py-10">
        <h2 className="text-2xl font-extrabold">One-time boosts</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {boosts.map((b) => (
            <Card key={b.name} className="border-gold/50">
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><b.icon className="size-5 text-gold-dark" />{b.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-3xl font-extrabold text-navy">{b.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
                <a href={whatsappLink(siteConfig.whatsappNumber, b.wa)} target="_blank" rel="noreferrer">
                  <Button className="mt-4 w-full bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />Activate via WhatsApp</Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mt-10 text-2xl font-extrabold">Dealer plans</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={p.hot ? "border-2 border-gold shadow-lg" : ""}>
              <CardHeader>
                {p.hot && <span className="w-fit rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-navy">MOST POPULAR</span>}
                <CardTitle className="flex items-center gap-2 text-lg"><p.icon className="size-5 text-gold-dark" />{p.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{p.tag}</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-extrabold text-navy">{p.price}<span className="text-sm font-normal text-muted-foreground">{p.per}</span></p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {p.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />{f}</li>)}
                </ul>
                <a href={whatsappLink(siteConfig.whatsappNumber, p.wa)} target="_blank" rel="noreferrer">
                  <Button className={`mt-4 w-full ${p.hot ? "bg-navy text-gold-light hover:bg-navy-800" : ""}`} variant={p.hot ? "default" : "outline"}>Choose {p.name}</Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mt-10 text-2xl font-extrabold">How featuring works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <div key={t} className="relative rounded-2xl border bg-card p-5">
              <span className="absolute right-4 top-4 text-4xl font-extrabold text-gold/25">0{i + 1}</span>
              <p className="font-bold">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-2xl font-extrabold">Questions, answered</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border bg-card p-5">
              <p className="font-bold">{f.q}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.t}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">Selling one car? <Link href="/sell" className="font-semibold text-gold-dark hover:underline">List it free</Link> — boost only if you want it gone faster.</p>
      </div>
    </div>
  );
}
