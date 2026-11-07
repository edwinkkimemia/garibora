import Link from "next/link";
import { BadgeCheck, Star, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";
import { shuffle } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata({
  title: "Verified car dealers in Kenya",
  description: "ID-checked car dealers in Nairobi, Mombasa, Kisumu and Eldoret. Verified yards, rated stock, WhatsApp-direct contact.",
  keywords: ["car dealers Nairobi", "verified car yards Kenya", "Mombasa car dealers", "buy from dealer Kenya"],
});
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const revalidate = 120;

export default async function DealersPage() {
  const dealersRaw = await prisma.dealer.findMany({ where: { verified: true }, orderBy: { rating: "desc" }, take: 24 }).catch(() => []);
  const dealers = shuffle(dealersRaw);
  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Dealers" }]} />
      <h1 className="text-3xl font-extrabold">Verified dealers</h1>
      <p className="mt-1 text-muted-foreground">ID-checked yards with physical location and trade history.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dealers.map((d) => (
          <Card key={d.id}><CardContent className="pt-5">
            <div className="flex items-center gap-2.5">
              <Avatar src={d.logoUrl} name={d.businessName} className="size-10" />
              <p className="flex min-w-0 items-center gap-1 font-bold"><span className="truncate">{d.businessName}</span> <BadgeCheck className="size-4 shrink-0 text-gold-dark" /></p>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5 shrink-0 text-gold-dark" />{d.location}, Kenya • ★ {d.rating.toFixed(1)} ({d.reviewCount} reviews)</p>
            <p className="mt-2 line-clamp-2 text-sm">{d.description}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/dealers/${d.slug}`}><Button variant="outline" size="sm">View stock →</Button></Link>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.businessName} ${d.location} Kenya`)}`} target="_blank" rel="noreferrer"><Button variant="ghost" size="sm"><MapPin />Yard</Button></a>
            </div>
          </CardContent></Card>
        ))}
        {dealers.length === 0 && <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground md:col-span-3">Seed the database to see demo dealers.</p>}
      </div>

      <div className="mt-10 rounded-3xl border border-gold/40 bg-gold/5 p-6 md:p-8">
        <p className="flex items-center gap-2 font-extrabold"><BadgeCheck className="size-5 text-emerald-600" /> What the Verified badge guarantees</p>
        <div className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <p className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /> The dealer&apos;s national ID and KRA PIN were checked against the registered business name.</p>
          <p className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /> The yard&apos;s physical location was confirmed — every card links straight to it on Google Maps.</p>
          <p className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /> Ratings come from completed Motiva deals, not paid reviews.</p>
          <p className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /> Badge lost on the first proven misrepresentation — verification is continuous, not one-off.</p>
        </div>
      </div>
    </div>
  );
}
