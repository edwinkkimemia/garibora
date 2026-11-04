import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, MessageCircle, PlusCircle, ArrowRight, TrendingUp, Crown } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { whatsappLink } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const uid = session!.user!.id!;
  const [byStatus, viewsAgg, unread, favs, recentInq, latest, top] = await Promise.all([
    prisma.car.groupBy({ by: ["status"], where: { sellerId: uid }, _count: true }).catch(() => []),
    prisma.car.aggregate({ where: { sellerId: uid }, _sum: { views: true } }).catch(() => ({ _sum: { views: 0 } })),
    prisma.inquiry.count({ where: { read: false, OR: [{ car: { is: { sellerId: uid } } }, { part: { is: { sellerId: uid } } }] } }).catch(() => 0),
    prisma.favorite.count({ where: { userId: uid } }).catch(() => 0),
    prisma.inquiry.findMany({ where: { OR: [{ car: { is: { sellerId: uid } } }, { part: { is: { sellerId: uid } } }] }, include: { car: { select: { title: true, slug: true } }, part: { select: { title: true, slug: true } } }, orderBy: { createdAt: "desc" }, take: 5 }).catch(() => []),
    prisma.car.findMany({ where: { sellerId: uid }, include: { images: true, dealer: { select: { businessName: true, logoUrl: true } }, seller: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" }, take: 4 }).catch(() => []),
    prisma.car.findMany({ where: { sellerId: uid, status: "ACTIVE" }, orderBy: { views: "desc" }, take: 5, select: { id: true, title: true, views: true, price: true } }).catch(() => []),
  ]);
  const count = (s: string) => byStatus.find((g) => g.status === s)?._count ?? 0;
  const maxViews = Math.max(1, ...top.map((t) => t.views));

  const stats: [string, number, string][] = [
    ["Active listings", count("ACTIVE"), "/dashboard/listings"],
    ["Pending review", count("PENDING"), "/dashboard/listings?status=PENDING"],
    ["Sold", count("SOLD"), "/dashboard/listings?status=SOLD"],
    ["Total views", viewsAgg._sum.views ?? 0, "/dashboard/listings"],
    ["Unread inquiries", unread, "/dashboard/inquiries"],
    ["Saved cars", favs, "/favorites"],
  ];

  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Dashboard" }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">Karibu, {session?.user?.name?.split(" ")[0] ?? "member"} 👋</h1>
          <p className="text-sm text-muted-foreground">Here&apos;s how your garage is performing today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/sell"><Button><PlusCircle />List a car</Button></Link>
          <Link href="/cars"><Button variant="outline">Browse cars</Button></Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map(([t, v, href]) => (
          <Link key={t as string} href={href as string}>
            <Card className="transition hover:border-gold hover:shadow-md">
              <CardHeader className="pb-1"><CardTitle className="text-xs font-medium text-muted-foreground">{t}</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-extrabold md:text-3xl">{v}</p></CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Recent inquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Latest inquiries {unread > 0 && <Badge variant="success">{unread} new</Badge>}</CardTitle>
            <Link href="/dashboard/inquiries" className="text-xs font-bold text-gold-dark hover:underline">View all →</Link>
          </CardHeader>
          <CardContent className="grid gap-2">
            {recentInq.map((q) => {
              const listing = q.car ?? q.part;
              return (
                <div key={q.id} className={`rounded-xl border p-3 text-sm ${q.read ? "" : "border-gold/50 bg-gold/5"}`}>
                  <p><b>{q.name}</b> <span className="text-muted-foreground">• {q.phone}</span></p>
                  <p className="truncate text-muted-foreground">Re: {listing?.title ?? "Listing"}</p>
                  <div className="mt-2">
                    <a href={whatsappLink(q.phone, `Hi ${q.name}, thanks for your interest in "${listing?.title ?? "your listing"}" on Motiva. When would you like to view it?`)} target="_blank" rel="noreferrer">
                      <Button size="sm" className="bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />Reply</Button>
                    </a>
                  </div>
                </div>
              );
            })}
            {recentInq.length === 0 && <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No inquiries yet — share your listings on WhatsApp to get leads.</p>}
          </CardContent>
        </Card>

        {/* Latest listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My latest listings</CardTitle>
            <Link href="/dashboard/listings" className="text-xs font-bold text-gold-dark hover:underline">Manage →</Link>
          </CardHeader>
          <CardContent className="grid gap-2">
            {latest.map((c) => (
              <Link key={c.id} href={`/cars/${c.slug}`} className="flex items-center gap-3 rounded-xl border p-2 transition hover:shadow-sm">
                <span className="relative block h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {c.images[0] && <Image src={c.images[0].url} alt={c.title} fill className="object-cover" sizes="100px" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{c.title}</span>
                  <span className="text-xs font-bold text-navy">{formatKES(c.price)}</span>
                </span>
                <Badge variant={c.status === "ACTIVE" ? "success" : "secondary"}>{c.status}</Badge>
              </Link>
            ))}
            {latest.length === 0 && <Link href="/sell"><Button className="w-full" variant="outline"><PlusCircle />List your first car — free</Button></Link>}
          </CardContent>
        </Card>
      </div>

      {/* Dealer plans upsell */}
      <Link href="/dashboard/plans" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-navy p-5 text-white transition hover:shadow-lg">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold text-navy"><Crown className="size-5" /></span>
          <div>
            <p className="font-extrabold">Selling more than a few cars? <span className="text-gold-light">Go Growth from KSh 4,999/mo.</span></p>
            <p className="text-sm text-slate-300">50 listings, verified yard badge, monthly boosts — pay by M-Pesa.</p>
          </div>
        </div>
        <span className="rounded-xl bg-gold px-4 py-2 text-sm font-bold text-navy">View plans →</span>
      </Link>

      {/* Top performing */}
      {top.length > 0 && (        <Card className="mt-6">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="size-4 text-gold-dark" /> Most viewed listings</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {top.map((t) => (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <span className="w-40 shrink-0 truncate font-medium md:w-64">{t.title}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-gradient-to-r from-navy to-gold" style={{ width: `${Math.max(4, Math.round((t.views / maxViews) * 100))}%` }} /></span>
                <span className="flex w-24 shrink-0 items-center justify-end gap-1 text-xs text-muted-foreground"><Eye className="size-3" />{t.views}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <p className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Heart className="size-3" /> {favs} cars saved</span>
        <span className="flex items-center gap-1"><MessageCircle className="size-3" /> Tip: verified, well-photographed cars get 3× more inquiries</span>
      </p>
    </div>
  );
}
