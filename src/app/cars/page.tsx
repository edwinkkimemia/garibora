import { Suspense } from "react";
import type { Metadata } from "next";
import { CarCard } from "@/components/cars/car-card";
import { FiltersPanel } from "@/components/cars/filters-panel";
import { SaveSearchButton } from "@/components/search/save-search-button";
import { searchCars, getSearchFacets } from "@/lib/queries";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { carFilterSchema } from "@/lib/validations";
import { baseMetadata } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = baseMetadata({
  title: "Buy cars in Kenya",
  description: "Search 100+ verified cars for sale in Kenya — Prado, Hilux, Note, CX-5 and more. Transparent KES prices, NTSA-checked dealers.",
  keywords: ["cars for sale Nairobi", "Toyota Prado price Kenya", "buy car Mombasa", "foreign used cars Kenya", "cheap cars Kenya", "Hilux for sale Kenya"],
});

export default async function CarsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const raw = await searchParams;
  const parsed = carFilterSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : { sort: "newest" as const, page: 1 };
  const { cars, total, page, totalPages, expanded } = await searchCars(filters as never).catch(() => ({ cars: [], total: 0, page: 1, totalPages: 1, expanded: [] as string[] }));
  const facets = (await getSearchFacets().catch(() => null)) ?? undefined;

  const makeLink = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(raw).forEach(([k, v]) => { if (v && k !== "page") sp.set(k, v); });
    sp.set("page", String(p));
    return `/cars?${sp.toString()}`;
  };

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Cars" }]} />
      <h1 className="text-3xl font-extrabold">Cars for sale in Kenya</h1>
      <p className="mt-1 text-muted-foreground">{total} verified results • Prices in KES</p>
      {expanded.length > 1 && (
        <p className="mt-2 inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-navy">
          Smart search also matched: {expanded.filter((t) => t !== expanded[0]).join(" • ")}
        </p>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside><div className="lg:sticky lg:top-20"><Suspense><FiltersPanel facets={facets} /></Suspense><div className="mt-3 hidden lg:block"><Suspense><SaveSearchButton /></Suspense></div></div></aside>
        <div>
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <span className="text-sm text-muted-foreground">{total} results</span>
            <Suspense><SaveSearchButton /></Suspense>
          </div>
          {cars.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <p className="font-bold">No cars match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try widening price or year, or seed the demo DB.</p>
              <Link href="/cars"><Button className="mt-4" variant="outline">Clear all</Button></Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {cars.map((c) => <CarCard key={c.id} car={c as never} />)}
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {page > 1 && <Link href={makeLink(page - 1)}><Button variant="outline">Previous</Button></Link>}
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              {page < totalPages && <Link href={makeLink(page + 1)}><Button variant="outline">Next</Button></Link>}
            </div>
          )}
        </div>
      </div>

      {/* SEO: buying guide + internal links */}
      <section className="mt-14 grid gap-6 rounded-3xl border bg-card p-6 md:grid-cols-3 md:p-8">
        <div>
          <h2 className="font-extrabold">Buying a car in Kenya?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Every listing shows real KES pricing, mileage and location. Favour <b>Verified</b> badge cars —
            duty status and condition reviewed — and always confirm the logbook on <b>NTSA TIMS</b> before
            paying. Budget 10–15% above price for transfer, service and tyres.
          </p>
          <Link href="/blog/ntsa-logbook-transfer-guide" className="mt-2 inline-block text-sm font-semibold text-gold-dark hover:underline">Read the transfer guide →</Link>
        </div>
        <div>
          <h2 className="font-extrabold">Shop by town</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"].map((l) => (
              <Link key={l} href={`/cars?location=${encodeURIComponent(l)}`} className="rounded-full border px-3 py-1 text-xs font-semibold transition hover:border-gold hover:text-gold-dark">{l}</Link>
            ))}
          </div>
          <h2 className="mt-4 font-extrabold">Popular right now</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {[["Prado", "/cars?q=Prado"], ["Hilux 4WD", "/cars?q=Hilux"], ["Note e-Power", "/cars?q=Note"], ["Under 1.5M", "/cars?maxPrice=1500000"], ["Hybrids", "/cars?fuelType=HYBRID"]].map(([t, h]) => (
              <Link key={t} href={h} className="rounded-full border px-3 py-1 text-xs font-semibold transition hover:border-gold hover:text-gold-dark">{t}</Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-extrabold">Good to know</h2>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/blog/kra-duty-calculator-import-car" className="hover:text-gold-dark hover:underline">How KRA duty shapes foreign-used prices</Link></li>
            <li><Link href="/blog/best-fuel-efficient-cars-nairobi" className="hover:text-gold-dark hover:underline">Most fuel-efficient cars for Nairobi traffic</Link></li>
            <li><Link href="/blog/car-loan-kenya-banks-vs-sacco" className="hover:text-gold-dark hover:underline">Banks vs SACCOs vs dealer finance</Link></li>
            <li><Link href="/blog/pre-purchase-inspection-checklist-kenya" className="hover:text-gold-dark hover:underline">17-point inspection checklist</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
