import { Suspense } from "react";
import type { Metadata } from "next";
import { CarCard } from "@/components/cars/car-card";
import { FiltersPanel } from "@/components/cars/filters-panel";
import { searchCars } from "@/lib/queries";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { carFilterSchema } from "@/lib/validations";
import { baseMetadata } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = baseMetadata({ title: "Buy cars in Kenya", description: "Search verified cars for sale in Kenya — Prado, Hilux, Note, CX-5 and more. Prices in KES." });

export default async function CarsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const raw = await searchParams;
  const parsed = carFilterSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : { sort: "newest" as const, page: 1 };
  const { cars, total, page, totalPages } = await searchCars(filters as never).catch(() => ({ cars: [], total: 0, page: 1, totalPages: 1 }));

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
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside><div className="lg:sticky lg:top-20"><Suspense><FiltersPanel /></Suspense></div></aside>
        <div>
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
    </div>
  );
}
