import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, KeyRound, Banknote, ShieldCheck, Wrench } from "lucide-react";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ShareButtons } from "@/components/cars/share-buttons";
import { formatKES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  if (!post || !post.published) notFound();
  const more = await prisma.post.findMany({
    where: { published: true, slug: { not: slug } },
    select: { slug: true, title: true, excerpt: true, coverUrl: true },
    orderBy: { createdAt: "desc" }, take: 4,
  }).catch(() => []);
  const featuredCars = await prisma.car.findMany({
    where: { status: "ACTIVE", listingType: "SALE", featured: true },
    select: { slug: true, title: true, price: true, images: { select: { url: true }, take: 1 } },
    orderBy: { createdAt: "desc" }, take: 3,
  }).catch(() => []);

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Insights", href: "/blog" }, { label: post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title }]} />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0">
          <h1 className="text-3xl font-extrabold md:text-4xl">{post.title}</h1>
          <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
          <div className="mt-4"><ShareButtons title={post.title} path={`/blog/${post.slug}`} /></div>
          {post.coverUrl && <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-2xl"><Image src={post.coverUrl} alt={post.title} fill className="object-cover" sizes="800px" /></div>}
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
            {post.content.split("\n\n").map((para, i) => <p key={i} className={i === 0 ? "text-lg font-medium text-foreground" : "text-muted-foreground"}>{para}</p>)}
            <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5">
              <h2 className="font-extrabold">Key takeaways for Kenyan buyers</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground"><li>Always verify the logbook on NTSA TIMS before paying.</li><li>Insist on duty-paid proof for foreign-used units.</li><li>Budget 10–15% above price for transfer, service and tyres.</li></ul>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-muted/60 p-4">
            <p className="text-sm font-bold">Was this guide useful? Share it:</p>
            <ShareButtons title={post.title} path={`/blog/${post.slug}`} />
          </div>
        </article>

        <aside className="grid gap-4 lg:sticky lg:top-20">
          <Card>
            <CardHeader><CardTitle className="text-base">More guides</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              {more.map((m) => (
                <Link key={m.slug} href={`/blog/${m.slug}`} className="group flex gap-3">
                  {m.coverUrl && <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"><Image src={m.coverUrl} alt="" fill className="object-cover" sizes="100px" /></span>}
                  <span className="min-w-0"><span className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-gold-dark">{m.title}</span></span>
                </Link>
              ))}
              {more.length === 0 && <p className="text-sm text-muted-foreground">More guides coming soon.</p>}
            </CardContent>
          </Card>
          {featuredCars.length > 0 && (
            <Card className="border-gold/40">
              <CardHeader><CardTitle className="text-base">Featured cars <span className="ml-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-dark">VERIFIED</span></CardTitle></CardHeader>
              <CardContent className="grid gap-3">
                {featuredCars.map((c) => (
                  <Link key={c.slug} href={`/cars/${c.slug}`} className="group flex gap-3">
                    <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {c.images[0] && <Image src={c.images[0].url} alt={c.title} fill className="object-cover" sizes="100px" />}
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-gold-dark">{c.title}</span>
                      <span className="text-sm font-extrabold text-navy">{formatKES(c.price)}</span>
                    </span>
                  </Link>
                ))}
                <Link href="/cars"><Button size="sm" variant="outline" className="w-full">Browse all cars</Button></Link>
              </CardContent>
            </Card>
          )}
          <Card className="border-gold/40 bg-gradient-to-br from-navy to-navy-800 text-white">
            <CardContent className="pt-5">
              <p className="font-extrabold">Reading about it? <span className="text-gold-light">Drive it.</span></p>
              <p className="mt-1 text-sm text-slate-300">Browse 140+ verified cars with transparent KES pricing.</p>
              <Link href="/cars"><Button className="mt-3 w-full bg-gold text-navy hover:bg-gold-dark hover:text-white">Browse cars <ArrowRight /></Button></Link>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Other services */}
      <section className="mt-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">More from Motiva</p>
        <h2 className="mt-1 text-2xl font-extrabold">Everything for your car, in one place</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: KeyRound, t: "Hire a car", d: "Verified rentals from KSh 4,000/day.", href: "/rentals" },
            { icon: Banknote, t: "Finance it", d: "Loans, logbook cash & calculator.", href: "/financing" },
            { icon: ShieldCheck, t: "Insure it", d: "Cover in 60 seconds, from your phone.", href: "/insurance" },
            { icon: Wrench, t: "Parts & spares", d: "Tyres, batteries, brakes & more.", href: "/parts" },
          ].map((s) => (
            <Link key={s.href} href={s.href} className="group rounded-2xl border bg-card p-5 transition hover:border-gold hover:shadow-md">
              <span className="grid size-11 place-items-center rounded-xl bg-navy text-gold-light"><s.icon className="size-5" /></span>
              <p className="mt-3 flex items-center gap-1 font-bold">{s.t} <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-gold-dark" /></p>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
