import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Gauge, Fuel, Cog, Calendar, ShieldCheck, BadgeCheck, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { CarGallery } from "@/components/cars/car-gallery";
import { FavoriteButton } from "@/components/cars/favorite-button";
import { CarCard } from "@/components/cars/car-card";
import { InquiryForm } from "@/components/cars/inquiry-form";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCarById, getSimilarCars, getMarketInsight, getDealerCars } from "@/lib/queries";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { formatKES, formatMileage, whatsappLink } from "@/lib/utils";
import { baseMetadata, carJsonLd } from "@/lib/seo";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const car = await getCarById(id).catch(() => null);
  if (!car) return baseMetadata({ title: "Car not found" });
  return baseMetadata({
    title: `${car.year} ${car.make} ${car.model} — ${formatKES(car.price)}`,
    description: `${car.title} for sale in ${car.location}, Kenya. ${car.mileage}km, ${car.transmission}. ${car.verified ? "Verified & inspected." : ""}`,
    openGraph: { images: car.images[0] ? [car.images[0].url] : undefined },
  });
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await getCarById(id).catch(() => null);
  if (!car) notFound();

  const session = await auth().catch(() => null);
  let saved = false;
  if (session?.user?.id) {
    const f = await prisma.favorite.findUnique({
      where: { userId_carId: { userId: session.user.id, carId: car.id } } as never,
    }).catch(() => null);
    saved = !!f;
  }
  const similar = await getSimilarCars(car.id, car.make, car.bodyType, car.listingType).catch(() => []);
  const insight = await getMarketInsight(car.make, car.model, car.id).catch(() => ({ avg: null as number | null, count: 0 }));
  const dealerCars = car.dealerId
    ? await getDealerCars(car.dealerId, car.id).catch(() => [])
    : [];
  const sellerPhone = car.dealer?.whatsapp || car.dealer?.phone || car.seller.phone || siteConfig.whatsappNumber;
  const isRent = car.listingType === "RENT";
  const wa = whatsappLink(sellerPhone, isRent
    ? `Hi! I'd like to HIRE your ${car.title} (${formatKES(car.dailyRate ?? 0)}/day) on ${siteConfig.brandName}. Which dates are available?`
    : `Hi! I'm interested in your ${car.title} listed at ${formatKES(car.price)} on ${siteConfig.brandName}. Is it available?`);
  const diff = insight.avg ? Math.round(((car.price - insight.avg) / insight.avg) * 100) : null;

  const specs: [string, string][] = [
    ["Make / Model", `${car.make} ${car.model}`],
    ["Year", String(car.year)],
    ["Mileage", formatMileage(car.mileage)],
    ["Transmission", car.transmission],
    ["Fuel", car.fuelType],
    ["Body type", car.bodyType],
    ["Condition", car.condition.replace("_", " ")],
    ["Location", car.location],
    ["Engine", car.engineCc ? `${car.engineCc.toLocaleString()} cc` : "—"],
    ["Drive", car.drive ?? "—"],
    ["Color", car.color ?? "—"],
    ["Duty", car.dutyPaid ? "Paid ✓" : "Check with seller"],
  ];

  return (
    <div className="container py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd({ title: car.title, description: car.description, images: car.images.map((i) => i.url), price: car.price, year: car.year, make: car.make, model: car.model, mileage: car.mileage, url: `${siteConfig.url}/cars/${car.slug}` })) }} />
      <Breadcrumbs items={[{ label: "Cars", href: "/cars" }, { label: `${car.year} ${car.make} ${car.model}` }]} />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            {car.verified && <Badge variant="success"><BadgeCheck className="size-3" /> Inspected & verified</Badge>}
            {car.status === "SOLD" && <Badge variant="secondary">SOLD</Badge>}
            <Badge variant="outline">{car.condition.replace("_", " ")}</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">{car.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" />{car.location}, Kenya • {car.views} views</p>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton carId={car.id} saved={saved} />
          <a href={wa} target="_blank" rel="noreferrer"><Button className="bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />{isRent ? "WhatsApp to book" : "WhatsApp seller"}</Button></a>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <CarGallery images={car.images} title={car.title} />
          <Card className="mt-6">
            <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                {specs.map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-muted/60 p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-semibold">{v}</dd></div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader><CardTitle>Seller&apos;s notes</CardTitle></CardHeader>
            <CardContent><p className="whitespace-pre-line text-sm leading-relaxed">{car.description}</p></CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="pt-5">
              {isRent && car.dailyRate ? (
                <>
                  <p className="inline-block rounded-full bg-navy px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-light">For hire — not for sale</p>
                  <p className="mt-2 text-3xl font-extrabold text-primary">{formatKES(car.dailyRate)}<span className="text-base font-semibold text-muted-foreground">/day</span></p>
                  <p className="mt-1 text-sm text-muted-foreground">≈ {formatKES(car.dailyRate * 6)}/week • Refundable deposit + DL required</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-extrabold text-primary">{formatKES(car.price)}</p>
                  {car.negotiable && <p className="text-xs text-muted-foreground">Negotiable</p>}
                  {diff !== null && insight.count >= 2 && (
                    <p className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${diff <= 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>
                      {diff <= 0 ? `Fair deal — ${Math.abs(diff)}% below market avg` : `${diff}% above market avg`} ({insight.count} similar)
                    </p>
                  )}
                </>
              )}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <span className="rounded-lg bg-muted p-2"><Calendar className="mx-auto size-4" />{car.year}</span>
                <span className="rounded-lg bg-muted p-2"><Gauge className="mx-auto size-4" />{(car.mileage / 1000).toFixed(0)}k km</span>
                <span className="rounded-lg bg-muted p-2"><Fuel className="mx-auto size-4" />{car.fuelType}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={wa} target="_blank" rel="noreferrer"><Button className="w-full bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />WhatsApp</Button></a>
                {car.seller.phone && <a href={`tel:${car.seller.phone}`}><Button variant="outline" className="w-full"><Phone />Call</Button></a>}
              </div>
              {car.dealer && (
                <div className="mt-4 rounded-xl border p-3 text-sm">
                  <p className="font-bold">{car.dealer.businessName} {car.dealer.verified && <ShieldCheck className="inline size-4 text-green-600" />}</p>
                  <p className="text-muted-foreground">{car.dealer.location} • ★ {car.dealer.rating.toFixed(1)} ({car.dealer.reviewCount})</p>
                  <Link href={`/dealers/${car.dealer.slug}`} className="mt-1 inline-block text-primary hover:underline">View dealer →</Link>
                </div>
              )}
              <p className="mt-3 flex items-start gap-1 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 size-3 shrink-0" /> Safety: meet in public, verify logbook on NTSA, never pay before viewing.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Request details</CardTitle></CardHeader>
            <CardContent><InquiryForm carId={car.id} /></CardContent>
          </Card>
        </aside>
      </div>

      {dealerCars.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-extrabold">More from {car.dealer?.businessName}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dealerCars.map((c) => <CarCard key={c.id} car={c as never} />)}
          </div>
        </div>
      )}

      {/* BUYER SAFETY */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-navy via-navy-800 to-navy-700 p-6 text-white md:p-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-gold-light" />
          <h2 className="text-xl font-extrabold">Buy safe, drive happy</h2>
        </div>
        <ul className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
          <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> Verify the logbook on NTSA TIMS before paying a shilling.</li>
          <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> Ask for duty-payment receipts on all foreign-used cars.</li>
          <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> View in daylight, test-drive, and bring a trusted mechanic.</li>
          <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> Pay to the logbook owner and transfer ownership together.</li>
        </ul>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-extrabold">Similar cars</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((c) => <CarCard key={c.id} car={c as never} />)}
          </div>
        </div>
      )}
    </div>
  );
}
