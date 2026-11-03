import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";
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
            <p className="flex items-center gap-1 font-bold">{d.businessName} <ShieldCheck className="size-4 text-green-600" /></p>
            <p className="text-sm text-muted-foreground">{d.location} • ★ {d.rating.toFixed(1)} ({d.reviewCount} reviews)</p>
            <p className="mt-2 line-clamp-2 text-sm">{d.description}</p>
            <Link href={`/dealers/${d.slug}`}><Button variant="outline" size="sm" className="mt-3">View stock →</Button></Link>
          </CardContent></Card>
        ))}
        {dealers.length === 0 && <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground md:col-span-3">Seed the database to see demo dealers.</p>}
      </div>
    </div>
  );
}
