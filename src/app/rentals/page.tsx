import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { CarCard } from "@/components/cars/car-card";
import { FiltersPanel } from "@/components/cars/filters-panel";
import { SaveSearchButton } from "@/components/search/save-search-button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { searchCars, getSearchFacets } from "@/lib/queries";
import { carFilterSchema } from "@/lib/validations";
import { baseMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata = baseMetadata({
  title: "Hire a car in Kenya — daily & weekly rental",
  description: "Rent verified cars across Kenya: Prados, Hiace vans, hybrids from KSh 4,000/day. Self-drive & chauffeur, Nairobi, Mombasa, Kisumu.",
  keywords: ["car hire Nairobi", "rent a car Kenya", "Hiace hire", "Prado hire rates", "self drive Kenya", "car rental Mombasa"],
});

export default async function RentalsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const raw = await searchParams;
  const parsed = carFilterSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : { sort: "newest" as const, page: 1 };
  const { cars, total, page, totalPages, expanded } = await searchCars(filters as never, { rentalOnly: true }).catch(() => ({ cars: [], total: 0, page: 1, totalPages: 1, expanded: [] as string[] }));
  const facets = (await getSearchFacets({ rentalOnly: true }).catch(() => null)) ?? undefined;

  const makeLink = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(raw).forEach(([k, v]) => { if (v && k !== "page") sp.set(k, v); });
    sp.set("page", String(p));
    return `/rentals?${sp.toString()}`;
  };

  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Rentals" }]} /></div>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 sm:block" aria-hidden>
          <Image src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop" alt="" fill className="object-cover opacity-50" sizes="600px" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent" />
        </div>
        <div className="container relative py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Self-drive & chauffeur</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold md:text-5xl">Hire a verified car, from KSh 4,000/day.</h1>
          <p className="mt-3 max-w-xl text-slate-200">Prados for safari, Hiace vans for events, hybrids for town runs. Insured, serviced, WhatsApp booking.</p>
        </div>
      </section>

      <div className="container py-8">
        <p className="text-muted-foreground">{total} hire cars available</p>
        {expanded.length > 1 && (
          <p className="mt-2 inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-navy">
            Smart search also matched: {expanded.filter((t) => t !== expanded[0]).join(" • ")}
          </p>
        )}
        <div className="mt-4 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside><div className="lg:sticky lg:top-20"><FiltersPanel facets={facets} /><div className="mt-3 hidden lg:block"><Suspense><SaveSearchButton /></Suspense></div></div></aside>
          <div>
            <div className="mb-3 flex items-center justify-between lg:hidden">
              <span className="text-sm text-muted-foreground">{total} results</span>
              <Suspense><SaveSearchButton /></Suspense>
            </div>
            {cars.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-12 text-center">
                <p className="font-bold">No hire cars match your filters</p>
                <Link href="/rentals"><Button className="mt-4" variant="outline">Clear all</Button></Link>
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

        <section className="mt-12 grid gap-4 rounded-3xl border bg-card p-6 md:grid-cols-3 md:p-8">
          <div><h2 className="font-extrabold">How hiring works</h2><p className="mt-1 text-sm text-muted-foreground">Pick dates on WhatsApp, share your DL + ID, pay a refundable deposit. Most cars deliver within Nairobi.</p></div>
          <div><h2 className="font-extrabold">Own a car? Earn from it</h2><p className="mt-1 text-sm text-muted-foreground">List your car for hire and earn KSh 80,000–300,000 monthly. We verify drivers and handle deposits.</p></div>
          <div><h2 className="font-extrabold">Need it longer?</h2><p className="mt-1 text-sm text-muted-foreground">Weekly hires save ~15%, monthly ~30% off the daily rate. Ask the owner when you chat.</p></div>
        </section>
      </div>
    </div>
  );
}
