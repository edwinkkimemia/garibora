import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, BadgeCheck, Phone, Wrench } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ShareButtons } from "@/components/cars/share-buttons";
import { CarCard } from "@/components/cars/car-card";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { getFeaturedCars, getPartBySlug, getSimilarParts, getSellerParts } from "@/lib/queries";
import { PartCard } from "@/components/parts/part-card";
import { PartInquiryForm } from "@/components/parts/part-inquiry-form";
import { formatKES, whatsappLink } from "@/lib/utils";
import { baseMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

function label(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<ReturnType<typeof baseMetadata>> {
  const { slug } = await params;
  const part = await getPartBySlug(slug).catch(() => null);
  if (!part) return baseMetadata({ title: "Part not found" });
  return baseMetadata({
    title: `${part.title} — ${formatKES(part.price)}`,
    description: `${part.title} for sale in ${part.location}, Kenya. ${label(part.condition)} ${label(part.category).toLowerCase()} part.`,
  });
}

export default async function PartDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const part = await getPartBySlug(slug).catch(() => null);
  if (!part) notFound();
  const sellerPhone = part.dealer?.whatsapp || part.dealer?.phone || part.seller.phone || siteConfig.whatsappNumber;
  const wa = whatsappLink(sellerPhone, `Hi! I'm interested in your part "${part.title}" listed at ${formatKES(part.price)} on ${siteConfig.brandName}. Is it available?`);
  const [similar, sellerParts, featured] = await Promise.all([
    getSimilarParts(part.id, part.category).catch(() => []),
    getSellerParts(part.seller.id, part.id).catch(() => []),
    getFeaturedCars().catch(() => []),
  ]);

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Car parts", href: "/parts" }, { label: part.title.length > 40 ? part.title.slice(0, 40) + "…" : part.title }]} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{label(part.category)}</Badge>
            <Badge variant={part.condition === "NEW" ? "success" : "secondary"}>{label(part.condition)}</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">{part.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" />{part.location}, Kenya</p>
        </div>
        <ShareButtons title={part.title} path={`/parts/${part.slug}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border bg-muted">
            {part.images[0] && <Image src={part.images[0].url} alt={part.title} fill className="object-cover" priority sizes="800px" />}
          </div>
          {part.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {part.images.slice(1, 5).map((im) => (
                <div key={im.url} className="relative aspect-[16/10] overflow-hidden rounded-xl border"><Image src={im.url} alt={part.title} fill className="object-cover" sizes="200px" /></div>
              ))}
            </div>
          )}
          <Card className="mt-6">
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent><p className="whitespace-pre-line text-sm leading-relaxed">{part.description}</p></CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card>
            <CardContent className="pt-5">
              <p className="text-3xl font-extrabold text-navy">{formatKES(part.price)}</p>
              {part.negotiable && <p className="text-xs text-muted-foreground">Negotiable</p>}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={wa} target="_blank" rel="noreferrer"><Button className="w-full bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />WhatsApp</Button></a>
                {part.seller.phone && <a href={`tel:${part.seller.phone}`}><Button variant="outline" className="w-full"><Phone />Call</Button></a>}
              </div>
              {(part.dealer || part.seller.verified) && (
                <p className="mt-3 flex items-center gap-1 rounded-xl bg-emerald-50 p-2 text-xs font-semibold text-emerald-700"><ShieldCheck className="size-4" />{part.dealer ? `${part.dealer.businessName} — verified dealer` : "Verified seller"}</p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">Confirm part numbers match your car before paying. Meet in person for used items.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Enquire about this part</CardTitle></CardHeader>
            <CardContent><PartInquiryForm partTitle={part.title} price={part.price} phone={sellerPhone} /></CardContent>
          </Card>
          <Link href="/parts"><Button variant="outline" className="w-full">← More parts</Button></Link>
        </aside>
      </div>

      {sellerParts.length > 0 && (
        <div className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><Wrench className="size-5 text-gold-dark" /> More from this seller</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sellerParts.map((p) => <PartCard key={p.id} part={p as never} />)}
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-extrabold">Similar {label(part.category).toLowerCase()} parts</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => <PartCard key={p.id} part={p as never} />)}
          </div>
        </div>
      )}

      {/* PARTS SAFETY */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-navy via-navy-800 to-navy-700 p-6 text-white md:p-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-gold-light" />
          <h2 className="text-xl font-extrabold">Buy parts without stories</h2>
        </div>
        <ul className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
          <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> Match part numbers against your old part or VIN before paying.</li>
          <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> Test electrics on the spot — mirrors, lights, starters.</li>
          <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> Ask for warranty in writing: new (1yr), refurbished (6mo).</li>
          <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> Meet at the seller&apos;s shop; get a receipt with the car model noted.</li>
        </ul>
      </div>

      {featured.length > 0 && (
        <div className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-extrabold">Featured cars</h2>
            <Link href="/cars"><Button variant="outline" size="sm">View all <ArrowRight /></Button></Link>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((c) => <CarCard key={c.id} car={c as never} />)}
          </div>
        </div>
      )}
    </div>
  );
}
