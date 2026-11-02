import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, ClipboardCheck, Banknote, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "About us — Kenya's premium car marketplace",
  description: "Motiva is Kenya's premium car marketplace: verified dealers, inspected cars, transparent KES pricing. Nairobi to Mombasa, Kisumu to Nakuru.",
};

const values = [
  { icon: BadgeCheck, t: "Verified, always", d: "Every dealer passes ID and yard-location checks before their first listing goes live. No briefcase sellers." },
  { icon: ClipboardCheck, t: "Inspected stock", d: "Verification badges mean duty status, mileage and condition were reviewed — the same checklist our own team uses." },
  { icon: Banknote, t: "KES transparency", d: "Real prices in Kenyan Shillings, negotiable flags where honest. No 'price on negotiation' games." },
  { icon: MapPin, t: "Kenya first, mobile first", d: "Built for how Kenya actually buys cars: on phones, over WhatsApp, in Nairobi, Mombasa, Kisumu, Nakuru and beyond." },
];

export default function AboutPage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "About" }]} /></div>
      {/* Header band */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop" alt="Car on Kenyan highway at sunset" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy" />
        <div className="relative container py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Our story</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">Find your next drive.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Buying a car in Kenya used to mean endless WhatsApp forwards, unclear duty status and &quot;price on
            negotiation&quot;. Motiva fixes that with verified dealers, inspection badges and transparent KES
            pricing — from Kiambu Road to Moi Avenue, from Kisumu to Eldoret.
          </p>
          <div className="mt-6 flex flex-wrap gap-8">
            {[["Live cars", "500+"], ["Verified dealers", "120+"], ["Towns served", "15+"], ["WhatsApp response", "< 1 hr"]].map(([k, v]) => (
              <div key={k}><p className="text-2xl font-extrabold text-gold-light">{v}</p><p className="text-xs uppercase tracking-wider text-slate-300">{k}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">What we promise</p>
        <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">A marketplace you can trust with millions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.t} className="rounded-2xl border bg-card p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-navy text-gold-light"><v.icon className="size-5" /></span>
              <p className="mt-3 font-bold">{v.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Towns */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <h2 className="text-2xl font-extrabold">Serving all of Kenya, expanding across East Africa</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Search verified stock by town — every listing shows its real location, and every dealer has a physical yard you can visit.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {siteConfig.locations.map((l) => (
              <Link key={l} href={`/cars?location=${encodeURIComponent(l)}`} className="rounded-full border bg-card px-4 py-2 text-sm font-semibold transition hover:border-gold hover:text-gold-dark">{l}</Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cars"><Button size="lg">Browse cars</Button></Link>
            <Link href="/sell"><Button size="lg" variant="outline">Sell your car — free</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
