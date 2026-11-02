import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

export const metadata = {
  title: "Contact us — Nairobi, Kenya",
  description: "Talk to Motiva: Kiambu Road Nairobi, +254 700 000 000, hello@motiva.co.ke. Buyer help, seller onboarding and dealer verification.",
};

export default function ContactPage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Contact" }]} /></div>
      <section className="bg-navy text-white">
        <div className="container py-14 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Karibu — we reply fast</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Talk to a human.</h1>
          <p className="mt-3 max-w-xl text-slate-200">Buying advice, selling help, dealer verification or reporting a listing — Nairobi team, Mon–Sat.</p>
        </div>
      </section>
      <section className="container py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {[
              { icon: MapPin, t: "Visit", d: "Kiambu Road, Nairobi, Kenya" },
              { icon: Phone, t: "Call", d: "+254 700 000 000" },
              { icon: Mail, t: "Email", d: "hello@motiva.co.ke" },
              { icon: Clock, t: "Hours", d: "Mon–Sat, 8am–6pm EAT" },
            ].map((c) => (
              <Card key={c.t}><CardContent className="pt-5">
                <span className="grid size-10 place-items-center rounded-xl bg-navy text-gold-light"><c.icon className="size-5" /></span>
                <p className="mt-2 font-bold">{c.t}</p><p className="text-sm text-muted-foreground">{c.d}</p>
              </CardContent></Card>
            ))}
            <a className="sm:col-span-2" href={whatsappLink(siteConfig.whatsappNumber, "Hi Motiva! I need help.")} target="_blank" rel="noreferrer">
              <Button className="w-full bg-[#25D366] text-base hover:bg-[#1eb85a]" size="lg"><WhatsAppIcon /> Chat on WhatsApp</Button>
            </a>
          </div>
          <Card><CardHeader><CardTitle className="text-lg">Send a message</CardTitle></CardHeader>
            <CardContent><form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div><Label>Name</Label><Input required placeholder="Your name" /></div>
              <div><Label>Email</Label><Input type="email" required placeholder="you@example.com" /></div>
              <div><Label>Topic</Label><Input placeholder="Buying, selling, dealer onboarding…" /></div>
              <div><Label>Message</Label><Textarea required placeholder="How can we help?" /></div>
              <Button className="w-full">Send message</Button>
            </form></CardContent></Card>
        </div>
      </section>
    </div>
  );
}
