import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PartCard, partLabel } from "@/components/parts/part-card";
import { searchParts, type PartFilters } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata({
  title: "Car parts in Kenya — tyres, batteries, brakes & more",
  description: "Genuine and quality used car parts in Kenya: tyres, batteries, brake pads, shocks, mirrors, lights. Verified sellers, KES prices, WhatsApp direct.",
  keywords: ["car parts Kenya", "tyres Nairobi price", "car battery Kenya", "brake pads price Kenya", "side mirror Note", "auto spare parts Kenya"],
});
export const revalidate = 60;

const categories = ["TYRES_WHEELS", "BATTERY", "BRAKES", "SUSPENSION", "ENGINE", "ELECTRICAL", "BODY", "ACCESSORIES", "OILS_FLUIDS"];
const conditions = ["NEW", "USED", "REFURBISHED"];
const locations = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];

export default async function PartsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const raw = await searchParams;
  const filters: PartFilters = {
    q: raw.q, category: raw.category, condition: raw.condition, location: raw.location,
    maxPrice: raw.maxPrice ? Number(raw.maxPrice) : undefined,
    sort: (raw.sort as PartFilters["sort"]) || "newest", page: raw.page ? Number(raw.page) : 1,
  };
  const { parts, total, page, totalPages } = await searchParts(filters).catch(() => ({ parts: [], total: 0, page: 1, totalPages: 1 }));

  const qs = (over: Record<string, string>) => {
    const sp = new URLSearchParams();
    Object.entries({ ...raw, ...over }).forEach(([k, v]) => { if (v) sp.set(k, v); });
    return `/parts?${sp.toString()}`;
  };

  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Car parts" }]} /></div>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 sm:block" aria-hidden>
          <Image src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop" alt="" fill className="object-cover opacity-50" sizes="600px" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent" />
        </div>
        <div className="container relative py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Genuine & quality used</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold md:text-5xl">Car parts, minus the Industrial Area hunt.</h1>
          <p className="mt-3 max-w-xl text-slate-200">Tyres, batteries, brakes, mirrors, lights — verified sellers, fixed KES prices, WhatsApp direct.</p>
          <form action="/parts" className="mt-6 flex max-w-xl gap-2">
            <Input name="q" defaultValue={raw.q ?? ""} placeholder="Search — try 'brake pads', 'battery', 'mirror'…" className="border-white/20 bg-white text-slate-900" />
            <Button type="submit" className="bg-gold text-navy hover:bg-gold-dark hover:text-white">Search</Button>
          </form>
        </div>
      </section>

      <div className="container py-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/parts"><Button size="sm" variant={!raw.category ? "default" : "outline"}>All</Button></Link>
          {categories.map((c) => (
            <Link key={c} href={qs({ category: raw.category === c ? "" : c, page: "" })}><Button size="sm" variant={raw.category === c ? "default" : "outline"}>{partLabel(c)}</Button></Link>
          ))}
        </div>
        <form className="mt-3 flex flex-wrap gap-2" action="/parts" method="get">
          {raw.q && <input type="hidden" name="q" value={raw.q} />}
          {raw.category && <input type="hidden" name="category" value={raw.category} />}
          <Select name="condition" defaultValue={raw.condition ?? ""} className="w-40" aria-label="Condition">
            <option value="">Any condition</option>{conditions.map((c) => <option key={c} value={c}>{partLabel(c)}</option>)}
          </Select>
          <Select name="location" defaultValue={raw.location ?? ""} className="w-40" aria-label="Location">
            <option value="">All Kenya</option>{locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
          <Select name="maxPrice" defaultValue={raw.maxPrice ?? ""} className="w-44" aria-label="Max price">
            <option value="">Any price</option>
            <option value="5000">Under 5K</option><option value="20000">Under 20K</option>
            <option value="50000">Under 50K</option><option value="150000">Under 150K</option>
          </Select>
          <Button type="submit" size="sm" variant="secondary">Apply</Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">{total} parts found</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {parts.map((p) => <PartCard key={p.id} part={p as never} />)}
        </div>
        {parts.length === 0 && <p className="mt-6 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No parts match — seed the database or list your own via WhatsApp.</p>}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {page > 1 && <Link href={qs({ page: String(page - 1) })}><Button variant="outline">Previous</Button></Link>}
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={qs({ page: String(page + 1) })}><Button variant="outline">Next</Button></Link>}
          </div>
        )}
      </div>
    </div>
  );
}
