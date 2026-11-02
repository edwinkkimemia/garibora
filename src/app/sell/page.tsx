import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera, ClipboardCheck, MessageCircle, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SellForm } from "@/components/sell/sell-form";
import { SellPartForm } from "@/components/sell/sell-part-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

export const metadata = { title: "Sell your car or part — free listing" };

const tips = [
  { icon: Camera, t: "Photos sell cars", d: "6+ shots: front 3/4, rear, interior, dashboard mileage, engine bay. Daylight, clean car." },
  { icon: ClipboardCheck, t: "Paperwork ready", d: "Logbook, KRA PIN match, duty receipt for imports. Transfer happens on NTSA TIMS together." },
  { icon: MessageCircle, t: "Reply fast", d: "Leads go cold in hours. WhatsApp inquiries land instantly — keep your phone close." },
  { icon: ShieldCheck, t: "Get verified", d: "ID-verified sellers get the badge and 3× more inquiries. Verify free on your profile." },
];

export default async function SellPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/sell");
  const { type } = await searchParams;
  const isPart = type === "part";

  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: isPart ? "Sell a part" : "Sell your car" }]} /></div>
      <section className="bg-navy text-white">
        <div className="container flex flex-wrap items-end justify-between gap-4 py-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Free listing • live after review</p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{isPart ? "List a part — free" : "List your car — free"}</h1>
            <p className="mt-2 max-w-xl text-slate-200">
              {isPart
                ? "Reach thousands of car owners hunting for spares. Live after a quick review."
                : "Takes ~3 minutes. Reviewed, then live to thousands of buyers across Kenya."}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/sell"><Button size="sm" variant={isPart ? "outline" : "default"} className={isPart ? "border-white/30 text-white hover:bg-white/10" : "bg-gold text-navy hover:bg-gold-dark hover:text-white"}>Sell a car</Button></Link>
            <Link href="/sell?type=part"><Button size="sm" variant={isPart ? "default" : "outline"} className={isPart ? "bg-gold text-navy hover:bg-gold-dark hover:text-white" : "border-white/30 text-white hover:bg-white/10"}>Sell a part</Button></Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 md:px-6">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">{isPart ? <SellPartForm /> : <SellForm />}</div>
          <aside className="grid gap-4 lg:sticky lg:top-20">
            <Card className="border-gold/40 bg-gradient-to-br from-navy to-navy-800 text-white">
              <CardHeader><CardTitle className="text-base text-gold-light">Sell 3× faster</CardTitle></CardHeader>
              <CardContent className="grid gap-4">
                {tips.map((t) => (
                  <div key={t.t} className="flex gap-2.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold text-navy"><t.icon className="size-4" /></span>
                    <div><p className="text-sm font-bold">{t.t}</p><p className="text-xs leading-relaxed text-slate-300">{t.d}</p></div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Stuck on the form?</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Chat us a photo of your logbook and we&apos;ll help draft the listing free.</p>
                <a href={whatsappLink(siteConfig.whatsappNumber, "Hi Motiva! Help me list my car.")} target="_blank" rel="noreferrer">
                  <Button className="mt-3 w-full bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />WhatsApp help</Button>
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
