import Link from "next/link";
import { BarChart3, Eye, Heart, Search, ArrowLeftRight, Landmark, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CarCard } from "@/components/cars/car-card";
import { baseMetadata } from "@/lib/seo";
import prisma from "@/lib/prisma";
import { formatKES } from "@/lib/utils";

export const metadata = baseMetadata({
  title: "Market data — most searched cars & prices in Kenya",
  description:
    "Live Kenya car market data: most searched makes, average prices by make and body type, most viewed and most wishlisted cars, foreign-used vs new splits.",
  keywords: ["car prices Kenya", "Toyota price Kenya", "most popular cars Kenya", "car market data Nairobi"],
});

type Row = { label: string; count: number; avg: number | null };

async function getData() {
  const fallback = {
    total: 0, avg: null as number | null, median: null as number | null,
    makes: [] as Row[], bodies: [] as Row[], conditions: [] as Row[],
    bands: [] as { label: string; count: number }[],
    topViewed: [] as never[], topSaved: [] as { car: never; saves: number }[],
    topSearches: [] as { label: string; count: number }[],
    perks: { tradeIn: 0, financing: 0 },
  };
  try {
    const active = { status: "ACTIVE" } as const;
    const [total, avgAgg, makeGroups, bodyGroups, condGroups, prices, topViewed, saveGroups, searches, tradeIn, financing] =
      await Promise.all([
        prisma.car.count({ where: active }),
        prisma.car.aggregate({ where: active, _avg: { price: true } }),
        prisma.car.groupBy({ by: ["make"], where: active, _avg: { price: true }, _count: true }),
        prisma.car.groupBy({ by: ["bodyType"], where: active, _avg: { price: true }, _count: true }),
        prisma.car.groupBy({ by: ["condition"], where: active, _count: true }),
        prisma.car.findMany({ where: active, select: { price: true }, take: 5000 }),
        prisma.car.findMany({
          where: active, orderBy: { views: "desc" }, take: 4,
          include: { images: true, dealer: { select: { businessName: true, logoUrl: true } }, seller: { select: { name: true, image: true } } },
        }),
        prisma.favorite.groupBy({ by: ["carId"], _count: { carId: true }, orderBy: { _count: { carId: "desc" } }, take: 20 }),
        prisma.savedSearch.findMany({ select: { filters: true }, take: 500, orderBy: { createdAt: "desc" } }),
        prisma.car.count({ where: { ...active, tradeInAccepted: true } }),
        prisma.car.count({ where: { ...active, financingAvailable: true } }),
      ]);

    const sorted = prices.map((p) => p.price).sort((a, b) => a - b);
    const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
    const band = (lo: number, hi: number, label: string) => ({
      label, count: sorted.filter((p) => p >= lo && p < hi).length,
    });
    const makes: Row[] = makeGroups
      .map((g) => ({ label: g.make, count: g._count, avg: g._avg.price ? Math.round(g._avg.price) : null }))
      .sort((a, b) => b.count - a.count).slice(0, 10);
    const bodies: Row[] = bodyGroups
      .map((g) => ({ label: String(g.bodyType).replace(/_/g, " "), count: g._count, avg: g._avg.price ? Math.round(g._avg.price) : null }))
      .sort((a, b) => b.count - a.count);
    const conditions: Row[] = condGroups
      .map((g) => ({ label: String(g.condition).replace(/_/g, " "), count: g._count, avg: null }))
      .sort((a, b) => b.count - a.count);

    // Most wishlisted (saves) — resolve car records, keep ACTIVE only
    const saveSorted = [...saveGroups].sort((a, b) => b._count.carId - a._count.carId).slice(0, 4);
    const savedCars = saveSorted.length
      ? await prisma.car.findMany({
          where: { id: { in: saveSorted.map((s) => s.carId) }, ...active },
          include: { images: true, dealer: { select: { businessName: true, logoUrl: true } }, seller: { select: { name: true, image: true } } },
        }).catch(() => [])
      : [];
    const topSaved = saveSorted
      .map((s) => ({ car: savedCars.find((c) => c.id === s.carId) as never | undefined, saves: s._count.carId }))
      .filter((r): r is { car: never; saves: number } => !!r.car);

    // Most searched — tally SavedSearch filter values
    const tally = new Map<string, number>();
    for (const s of searches) {
      const f = (s.filters ?? {}) as Record<string, unknown>;
      const parts: string[] = [];
      if (typeof f.make === "string" && f.make) parts.push(`Make: ${f.make}`);
      if (typeof f.bodyType === "string" && f.bodyType) parts.push(`Type: ${String(f.bodyType).replace(/_/g, " ")}`);
      if (typeof f.q === "string" && f.q) parts.push(`“${f.q}”`);
      if (typeof f.condition === "string" && f.condition) parts.push(String(f.condition).replace(/_/g, " "));
      for (const p of parts) tally.set(p, (tally.get(p) ?? 0) + 1);
    }
    const topSearches = [...tally.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count).slice(0, 8);

    return {
      total,
      avg: avgAgg._avg.price ? Math.round(avgAgg._avg.price) : null,
      median, makes, bodies, conditions, topViewed: topViewed as never[], topSaved,
      topSearches,
      bands: [band(0, 1_000_000, "Under 1M"), band(1_000_000, 2_000_000, "1–2M"), band(2_000_000, 5_000_000, "2–5M"), band(5_000_000, Infinity, "5M+")],
      perks: { tradeIn, financing },
    };
  } catch {
    return fallback;
  }
}

function AvgTable({ rows, title }: { rows: Row[]; title: string }) {
  if (!rows.length) return null;
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="font-extrabold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="font-semibold">{r.label} <span className="font-normal text-muted-foreground">({r.count})</span></span>
              <span className="font-extrabold text-navy">{r.avg ? formatKES(r.avg) : "—"}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gold" style={{ width: `${Math.max(6, Math.round((r.count / max) * 100))}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function MarketDataPage() {
  const d = await getData();
  const stats = [
    { icon: BarChart3, label: "Live listings", value: d.total ? d.total.toLocaleString() : "—" },
    { icon: TrendingUp, label: "Average asking price", value: d.avg ? formatKES(d.avg) : "—" },
    { icon: TrendingUp, label: "Median asking price", value: d.median ? formatKES(d.median) : "—" },
    { icon: ArrowLeftRight, label: "Accept trade-in", value: d.perks.tradeIn ? d.perks.tradeIn.toLocaleString() : "—" },
    { icon: Landmark, label: "Asset finance available", value: d.perks.financing ? d.perks.financing.toLocaleString() : "—" },
  ];
  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Market data" }]} />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Buyer & seller intelligence</p>
      <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">What Kenya is searching & paying</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Live numbers from current listings, buyer searches and wishlists. Sellers: price against the averages.
        Buyers: spot fair deals and high-demand models before they sell.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-4">
            <s.icon className="size-4 text-gold-dark" />
            <p className="mt-2 text-xl font-extrabold text-navy">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <AvgTable rows={d.makes} title="Average price by make (top 10 by stock)" />
        <AvgTable rows={d.bodies} title="Average price by body type" />
        <div className="space-y-5">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="flex items-center gap-2 font-extrabold"><Search className="size-4 text-gold-dark" /> Most searched right now</h2>
            {d.topSearches.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Search alerts are just getting started — check back soon, or <Link href="/cars" className="font-semibold text-gold-dark hover:underline">browse all cars</Link>.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {d.topSearches.map((s, i) => (
                  <li key={s.label} className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm">
                    <span className="font-semibold"><span className="mr-2 text-gold-dark">#{i + 1}</span>{s.label}</span>
                    <span className="text-xs text-muted-foreground">{s.count} alerts</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-extrabold">Demand: new vs used imports</h2>
            {d.conditions.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {d.conditions.map((c) => (
                  <li key={c.label} className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                    <span className="font-semibold">{c.label}</span>
                    <span className="text-muted-foreground">{c.count} cars</span>
                  </li>
                ))}
              </ul>
            )}
            <h2 className="mt-5 font-extrabold">Stock by price band</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {d.bands.map((b) => (
                <li key={b.label} className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                  <span className="font-semibold">KES {b.label}</span>
                  <span className="text-muted-foreground">{b.count} cars</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {d.topViewed.length > 0 && (
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><Eye className="size-5 text-gold-dark" /> Most viewed this week</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.topViewed.map((c: never) => <CarCard key={(c as { id: string }).id} car={c} />)}
          </div>
        </div>
      )}

      {d.topSaved.length > 0 && (
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><Heart className="size-5 fill-red-500 text-red-500" /> Most wishlisted by buyers</h2>
          <p className="mt-1 text-sm text-muted-foreground">Cars buyers tap the heart on — strong demand signals for sellers.</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.topSaved.map(({ car }) => <CarCard key={(car as { id: string }).id} car={car} />)}
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-4 rounded-3xl bg-navy p-6 text-white md:grid-cols-2 md:p-8">
        <div>
          <h2 className="font-extrabold">Selling? Price it right.</h2>
          <p className="mt-1 text-sm text-slate-300">Cars priced within 5% below the average for their make sell fastest. Add trade-in and financing options to widen your buyer pool.</p>
          <Link href="/sell" className="mt-3 inline-block rounded-xl bg-gold px-4 py-2 text-sm font-bold text-navy">List your car →</Link>
        </div>
        <div>
          <h2 className="font-extrabold">Buying? Move fast on fair deals.</h2>
          <p className="mt-1 text-sm text-slate-300">High-saves cars move in days. Save searches, wishlist favourites and filter by trade-in or financing to match your budget.</p>
          <Link href="/cars" className="mt-3 inline-block rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white">Browse cars →</Link>
        </div>
      </div>
    </div>
  );
}
