import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, BadgeCheck, Banknote, Star, ArrowRight, ClipboardCheck, KeyRound, Search, Quote } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { SearchBar } from "@/components/home/search-bar";
import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getHomeData() {
  try {
    const sale = { status: "ACTIVE", listingType: "SALE" } as const;
    const [featured, newCars, recent, hireCars, dealers, posts, total] = await Promise.all([
      prisma.car.findMany({ where: { ...sale, featured: true, OR: [{ featuredUntil: null }, { featuredUntil: { gte: new Date() } }] }, take: 8, include: { images: true }, orderBy: { createdAt: "desc" } }),
      prisma.car.findMany({ where: { ...sale, condition: "NEW" }, take: 4, include: { images: true }, orderBy: { createdAt: "desc" } }),
      prisma.car.findMany({ where: sale, take: 8, include: { images: true }, orderBy: { createdAt: "desc" } }),
      prisma.car.findMany({ where: { status: "ACTIVE", listingType: "RENT" }, take: 4, include: { images: true }, orderBy: { createdAt: "desc" } }),
      prisma.dealer.findMany({ where: { verified: true }, take: 3, orderBy: { rating: "desc" } }),
      prisma.post.findMany({ where: { published: true }, take: 3, orderBy: { createdAt: "desc" } }),
      prisma.car.count({ where: { status: "ACTIVE" } }),
    ]);
    return { featured, newCars, recent, hireCars, dealers, posts, total };
  } catch {
    return { featured: [], newCars: [], recent: [], hireCars: [], dealers: [], posts: [], total: 0 };
  }
}

const brands = [
  { name: "Toyota", img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=400&auto=format&fit=crop" },
  { name: "Nissan", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop" },
  { name: "Mercedes-Benz", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=400&auto=format&fit=crop" },
  { name: "BMW", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=400&auto=format&fit=crop" },
  { name: "Mazda", img: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?q=80&w=400&auto=format&fit=crop" },
  { name: "Subaru", img: "https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=400&auto=format&fit=crop" },
];

const bodyImages: Record<string, string> = {
  SUV: "photo-1533473353331-0135ef1b58bf",
  SEDAN: "photo-1618843479313-40f8afb4b4d8",
  PICKUP: "photo-1533106418989-88406c7cc8ca",
  HATCHBACK: "photo-1549317661-bd32c8ce0db2",
  VAN: "photo-1605893477799-b99e3b8b93fe",
  COMMERCIAL: "photo-1559416523-140ddc511d3a",
  COUPE: "photo-1555215695-3004980ad54e",
  CONVERTIBLE: "photo-1503376780353-7e6692767b70",
};
const thumb = (id: string) => `https://images.unsplash.com/${id}?q=80&w=600&auto=format&fit=crop`;

const testimonials = [
  { name: "Brian O.", place: "Nairobi", text: "Got a verified Prado with duty papers ready. The WhatsApp chat with the dealer took 10 minutes — viewing the same weekend." },
  { name: "Faith N.", place: "Mombasa", text: "As a first-time buyer I loved the inspection badge. Knew exactly what I was paying for, no stories." },
  { name: "David K.", place: "Nakuru", text: "Listed my Fielder on Friday, had three serious inquiries by Sunday. Sold the following week." },
];

export default async function HomePage() {
  const { featured, newCars, recent, hireCars, dealers, posts, total } = await getHomeData();

  return (
    <div>
      {/* HERO — search + trust pills, compact so Featured peeks above the fold */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-90">
          <Image src="/hero.jpg" alt="Premium cars in Nairobi at sunset" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/10 via-navy/25 to-navy" />
        <div className="relative container py-16 md:py-24">
          <div className="mx-auto max-w-4xl"><SearchBar /></div>
          <ul className="mx-auto mt-4 grid max-w-4xl grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { icon: BadgeCheck, t: "Verified dealers", d: "ID + yard checked" },
              { icon: ClipboardCheck, t: "Inspection badge", d: "Duty & condition reviewed" },
              { icon: WhatsAppIcon, t: "WhatsApp fast", d: "Chat sellers instantly" },
              { icon: Banknote, t: "KES transparent", d: "No hidden charges" },
            ].map((f) => (
              <li key={f.t} className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-left backdrop-blur-sm">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold text-navy"><f.icon className="size-4" /></span>
                <span className="min-w-0"><span className="block truncate text-[13px] font-bold leading-tight">{f.t}</span><span className="block truncate text-[11px] leading-tight text-slate-200">{f.d}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Hand-picked</p>
            <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Featured cars</h2>
          </div>
          <Link href="/cars"><Button variant="outline" size="sm">View all <ArrowRight /></Button></Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((c) => <CarCard key={c.id} car={c as never} />)}
        </div>
        {featured.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            No live cars yet — run <code className="rounded bg-muted px-2 py-1">npm run db:seed</code> to load sample Kenyan listings.
          </div>
        )}
      </section>

      {/* NEW ARRIVALS */}
      {newCars.length > 0 && (
        <section className="bg-navy py-12 text-white">
          <div className="container">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Showroom fresh</p>
                <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">New cars</h2>
              </div>
              <Link href="/cars?condition=NEW"><Button size="sm" className="bg-gold text-navy hover:bg-gold-dark hover:text-white">View all <ArrowRight /></Button></Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {newCars.map((c) => <CarCard key={c.id} car={c as never} />)}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="container py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Browse by need</p>
        <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Shop by category</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.bodyTypes.map((c) => (
            <Link key={c.value} href={`/cars?bodyType=${c.value}`} className="group overflow-hidden rounded-2xl border bg-white transition hover:border-gold hover:shadow-md">
              <div className="relative h-32 overflow-hidden">
                <Image src={thumb(bodyImages[c.value] ?? "photo-1503376780353-7e6692767b70")} alt={c.label} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="400px" />
                <span className="absolute bottom-2 left-2 rounded-full bg-navy/85 px-2.5 py-1 text-[11px] font-bold text-gold-light backdrop-blur-sm">{c.label}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div><p className="font-bold text-slate-900">{c.label}</p><p className="text-sm text-slate-500">{c.blurb}</p></div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy/5 text-navy transition group-hover:bg-navy group-hover:text-gold-light"><ArrowRight className="size-5" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Loved on Kenyan roads</p>
          <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Popular brands</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {brands.map((b) => (
              <Link key={b.name} href={`/cars?make=${encodeURIComponent(b.name)}`} className="group overflow-hidden rounded-2xl border bg-card transition hover:shadow-md">
                <div className="relative h-24"><Image src={b.img} alt={b.name} fill className="object-cover transition group-hover:scale-105" sizes="200px" /></div>
                <div className="flex items-center justify-between p-3">
                  <p className="text-sm font-bold">{b.name}</p>
                  <ArrowRight className="size-4 text-muted-foreground transition group-hover:text-gold-dark" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FRESH LISTINGS */}
      <section className="container py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Just landed</p>
            <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Fresh listings</h2>
          </div>
          <Link href="/cars?sort=newest"><Button variant="outline" size="sm">View all <ArrowRight /></Button></Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((c) => <CarCard key={c.id} car={c as never} />)}
        </div>
      </section>

      {/* HIRE */}
      {hireCars.length > 0 && (
        <section className="bg-navy py-12 text-white">
          <div className="container">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Self-drive & chauffeur</p>
                <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Hire a car from KSh 4,000/day</h2>
              </div>
              <Link href="/rentals"><Button size="sm" className="bg-gold text-navy hover:bg-gold-dark hover:text-white">All hire cars <ArrowRight /></Button></Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hireCars.map((c) => <CarCard key={c.id} car={c as never} />)}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Simple & safe</p>
          <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Buying in 4 steps</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { icon: Search, t: "Search & compare", d: "Filter by price in KES, year, mileage and town." },
              { icon: WhatsAppIcon, t: "Chat on WhatsApp", d: "Talk to the seller directly. No gatekeepers." },
              { icon: ClipboardCheck, t: "Inspect & verify", d: "Check NTSA TIMS, duty papers and test-drive." },
              { icon: KeyRound, t: "Pay & transfer", d: "Pay the logbook owner, transfer together." },
            ].map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border bg-card p-5">
                <span className="absolute right-4 top-4 text-4xl font-extrabold text-gold/25">0{i + 1}</span>
                <s.icon className="size-7 text-navy" />
                <p className="mt-3 font-bold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEALERS */}
      {dealers.length > 0 && (
        <section className="container py-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Trusted yards</p>
              <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Top verified dealers</h2>
            </div>
            <Link href="/dealers"><Button variant="outline" size="sm">All dealers <ArrowRight /></Button></Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {dealers.map((d) => (
              <Link key={d.id} href={`/dealers/${d.slug}`} className="rounded-2xl border bg-card p-5 transition hover:border-gold hover:shadow-md">
                <p className="flex items-center gap-1 font-bold">{d.businessName} <ShieldCheck className="size-4 text-emerald-600" /></p>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Star className="size-3 fill-gold text-gold" /> {d.rating.toFixed(1)} • {d.location}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* INSIGHTS */}
      {posts.length > 0 && (
        <section className="container pb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Guides & prices</p>
              <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Insights</h2>
            </div>
            <Link href="/blog"><Button variant="outline" size="sm">All articles <ArrowRight /></Button></Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group overflow-hidden rounded-2xl border bg-card transition hover:shadow-md">
                {p.coverUrl && <div className="relative h-40"><Image src={p.coverUrl} alt={p.title} fill className="object-cover transition group-hover:scale-105" sizes="400px" /></div>}
                <div className="p-4"><p className="font-bold leading-snug group-hover:text-gold-dark">{p.title}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p></div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* MONETIZATION: rent / finance / insure */}
      <section className="container pb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">More than a marketplace</p>
        <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Do more with your gari</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: KeyRound, t: "Hire a car", d: "Verified rentals from KSh 4,000/day — self-drive or chauffeur.", href: "/rentals" },
            { icon: Banknote, t: "Finance it", d: "Estimate monthly payments and get pre-qualified in minutes.", href: "/financing" },
            { icon: ShieldCheck, t: "Insure it", d: "Comprehensive or third-party cover, quoted in 60 seconds.", href: "/insurance" },
          ].map((m) => (
            <Link key={m.href} href={m.href} className="group rounded-2xl border bg-card p-5 transition hover:border-gold hover:shadow-md">
              <span className="grid size-11 place-items-center rounded-xl bg-navy text-gold-light"><m.icon className="size-5" /></span>
              <p className="mt-3 flex items-center gap-1 font-bold">{m.t} <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-gold-dark" /></p>
              <p className="mt-1 text-sm text-muted-foreground">{m.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-navy py-12 text-white">
        <div className="container">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Word on the street</p>
          <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Drivers who found their gari</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Quote className="size-6 text-gold" />
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-200">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm font-bold">{t.name} <span className="font-normal text-slate-400">• {t.place}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* SELL CTA */}
      <section className="container py-14">
        <div className="relative overflow-hidden rounded-3xl bg-navy text-white">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 opacity-30 md:block">
            <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" alt="Dealer handing over keys" fill className="object-cover" sizes="500px" />
          </div>
          <div className="relative max-w-xl p-8 md:p-12">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">For sellers & dealers</p>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Sell in days, not months.</h2>
            <p className="mt-2 text-slate-200">Free listing • WhatsApp inquiries • Verified badge boosts trust 3×.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/sell"><Button size="lg" className="bg-white text-navy hover:bg-gold-light">List your car — free</Button></Link>
              <Link href="/how-it-works"><Button size="lg" className="bg-gold text-navy hover:bg-gold-dark hover:text-white">How it works</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
