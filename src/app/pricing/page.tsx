import Link from "next/link";
import Image from "next/image";
import { Zap, Store, Check, MessageCircle, Crown } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata({
  title: "Pricing — featured listings & dealer plans",
  description: "How featuring works on Motiva: KSh 999 boosts, dealer plans from KSh 4,999/mo. Pay via M-Pesa, active in minutes.",
  keywords: ["motiva pricing", "feature car listing Kenya", "dealer plans Kenya", "promote car sale"],
});

const boosts = [
  { icon: Zap, name: "Featured — 7 days", price: "KSh 999", d: "Gold badge + top of search, homepage rail and category pages for a full week." },
  { icon: MessageCircle, name: "Top slot — 3 days", price: "KSh 499", d: "Pinned to the top of search results in your town for 72 hours." },
];

const plans = [
  {
    icon: Store, name: "Starter", price: "Free", per: "forever", tag: "For casual sellers", free: true,
    features: ["5 active listings", "WhatsApp inquiries", "Basic views stats", "Community support"],
    hot: false,
  },
  {
    icon: Crown, name: "Dealer Growth", price: "KSh 4,999", per: "/month", tag: "For active yards",
    features: ["50 active listings", "Verified yard badge", "1 free Featured boost / month", "Priority WhatsApp support", "Sold + inquiry analytics"],
    hot: true,
  },
  {
    icon: Store, name: "Dealer Premium", price: "KSh 9,999", per: "/month", tag: "For top dealers",
    features: ["Unlimited listings", "Homepage dealer spotlight", "4 free Featured boosts / month", "Dedicated account manager", "First access to new features"],
    hot: false,
  },
];

const steps = [
  ["Pick a boost or plan", "Boosts live on each of your listings; dealer plans live on your dashboard overview."],
  ["Tap Pay, enter M-Pesa number", "An STK push lands instantly. Enter your M-Pesa PIN — takes 10 seconds."],
  ["Live in minutes", "We confirm payment and flip the switch — badge, top placement and all, with an expiry date."],
];

const faqs = [
  { q: "How do featured cars get picked?", t: "Two ways: sellers buy a boost (gold Featured badge, top placement for 7 days), or our team hand-picks exceptional verified stock as staff picks (no charge)." },
  { q: "Where do featured cars appear?", t: "Top of search results, the homepage Featured rail, category pages and blog sidebars — anywhere buyers look first." },
  { q: "Do dealers pay to list?", t: "Listing is free up to 5 cars. Yards doing volume take Growth or Premium for more slots, the verified badge and monthly boosts." },
  { q: "What happens when a boost expires?", t: "The car stays live as a normal listing — only the badge and top placement end. Renew anytime from your dashboard." },
  { q: "Is there commission on sales?", t: "No. You keep 100% of the sale price — you only ever pay for visibility." },
  { q: "Can I pay with Till or Paybill manually?", t: "No — all payments go through instant STK push from your dashboard. It is faster, receipted automatically, and activates your boost or plan immediately." },
  { q: "Do boosts auto-renew?", t: "Never. Every boost has a fixed expiry date shown on your listing. Renew manually whenever you like." },
];

export default function PricingPage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Pricing" }]} /></div>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 sm:block" aria-hidden>
          <Image src="/hero.jpg" alt="" fill className="object-cover opacity-40" sizes="600px" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent" />
        </div>
        <div className="container relative py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">No commission. Ever.</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold md:text-5xl">Pay for visibility, keep the whole sale.</h1>
          <p className="mt-3 max-w-xl text-slate-200">Listing is free. When you want to sell faster, boost a car or take a dealer plan — paid securely by M-Pesa STK push, active in minutes.</p>
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
                <Link href="/dashboard/listings"><Button className="mt-4 w-full bg-gold text-navy hover:bg-gold-dark hover:text-white"><Zap />Boost from dashboard</Button></Link>
                <p className="mt-2 text-center text-xs text-muted-foreground">Pay securely via M-Pesa STK push in your dashboard</p>
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
                {p.free ? (
                  <Link href="/sell"><Button className="mt-4 w-full" variant="outline">Start free</Button></Link>
                ) : (
                  <>
                    <Link href="/dashboard"><Button className={`mt-4 w-full ${p.hot ? "bg-navy text-gold-light hover:bg-navy-800" : ""}`} variant={p.hot ? "default" : "outline"}>Pay from dashboard</Button></Link>
                    <p className="mt-2 text-center text-xs text-muted-foreground">Secure M-Pesa STK push, activated in minutes</p>
                  </>
                )}
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
