import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, MessageCircle, PlusCircle, ExternalLink, RotateCcw, Trash2, BadgeDollarSign, Zap } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";
import { markSoldAction, deleteListingAction, relistAction } from "@/lib/actions";
import { BoostModal } from "@/components/pay/boost-modal";

const tabs = ["ALL", "ACTIVE", "PENDING", "SOLD", "REJECTED"] as const;

/** A boost counts as live while flagged with no expiry or a future expiry. */
const boostActive = (c: { featured: boolean; featuredUntil: Date | null }) =>
  c.featured && (!c.featuredUntil || new Date(c.featuredUntil) > new Date());

export default async function ListingsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await auth();
  const { status } = await searchParams;
  const active = tabs.includes(status as never) ? (status as string) : "ALL";
  const cars = await prisma.car.findMany({
    where: { sellerId: session!.user!.id!, ...(active === "ALL" ? {} : { status: active as never }) },
    include: { images: true, _count: { select: { favorites: true, inquiries: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);
  const counts = await prisma.car.groupBy({ by: ["status"], where: { sellerId: session!.user!.id! }, _count: true }).catch(() => [] as { status: string; _count: number }[]);
  const total = counts.reduce((a, g) => a + g._count, 0);
  const countFor = (s: string) => counts.find((g) => g.status === s)?._count ?? 0;

  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Dashboard", href: "/dashboard" }, { label: "My listings" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl">My listings</h1>
        <Link href="/sell"><Button size="sm"><PlusCircle />New listing</Button></Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link key={t} href={t === "ALL" ? "/dashboard/listings" : `/dashboard/listings?status=${t}`}>
            <Button size="sm" variant={active === t ? "default" : "outline"}>
              {t.charAt(0) + t.slice(1).toLowerCase()} ({t === "ALL" ? total : countFor(t)})
            </Button>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        {cars.map((c) => (
          <div key={c.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
            <Link href={`/cars/${c.slug}`} className="relative block h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-40">
              {c.images[0] && <Image src={c.images[0].url} alt={c.title} fill className="object-cover" sizes="200px" />}
              {c.verified && <span className="absolute left-1.5 top-1.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">Verified</span>}
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{c.title}</p>
              <p className="mt-0.5 text-sm font-extrabold text-navy">{formatKES(c.price)} <Badge variant={c.status === "ACTIVE" ? "success" : c.status === "PENDING" ? "outline" : "secondary"}>{c.status}</Badge></p>
              {boostActive(c) && (
                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold-dark">
                  <Zap className="size-3" /> Featured{c.featuredUntil ? ` till ${new Date(c.featuredUntil).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}` : ""}
                </p>
              )}
              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Eye className="size-3" />{c.views} views</span>
                <span className="inline-flex items-center gap-1"><Heart className="size-3" />{c._count.favorites} saves</span>
                <span className="inline-flex items-center gap-1"><MessageCircle className="size-3" />{c._count.inquiries} inquiries</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Link href={`/cars/${c.slug}`}><Button size="sm" variant="outline"><ExternalLink />View</Button></Link>
                {c.status === "ACTIVE" && !boostActive(c) && <BoostModal carId={c.id} carTitle={c.title} />}
                {c.status === "ACTIVE" && <form action={async () => { "use server"; await markSoldAction(c.id); }}><Button size="sm" variant="secondary"><BadgeDollarSign />Mark sold</Button></form>}
                {c.status === "SOLD" && <form action={async () => { "use server"; await relistAction(c.id); }}><Button size="sm" variant="secondary"><RotateCcw />Relist</Button></form>}
                <form action={async () => { "use server"; await deleteListingAction(c.id); }}><Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 />Delete</Button></form>
              </div>
            </div>
          </div>
        ))}
        {cars.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="font-bold">Nothing here{active !== "ALL" ? ` under ${active.toLowerCase()}` : " yet"}</p>
            <p className="mt-1 text-sm text-muted-foreground">Listings appear here with views, saves and inquiries.</p>
            <Link href="/sell"><Button className="mt-4"><PlusCircle />List your first car</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
