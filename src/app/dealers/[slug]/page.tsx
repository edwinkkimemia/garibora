import { notFound } from "next/navigation";
import { BadgeCheck, Phone, Star, MapPin, Navigation } from "lucide-react";
import prisma from "@/lib/prisma";
import { shuffle } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CarCard } from "@/components/cars/car-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { whatsappLink } from "@/lib/utils";

export default async function DealerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dealer = await prisma.dealer.findUnique({ where: { slug }, include: { cars: { where: { status: "ACTIVE" }, include: { images: true, dealer: { select: { businessName: true, logoUrl: true } }, seller: { select: { name: true, image: true } } } } } }).catch(() => null);
  if (!dealer) notFound();
  dealer.cars = shuffle(dealer.cars);
  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Dealers", href: "/dealers" }, { label: dealer.businessName }]} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={dealer.logoUrl} name={dealer.businessName} className="size-14" />
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl"><span className="truncate">{dealer.businessName}</span> <BadgeCheck className="size-6 shrink-0 text-gold-dark" /></h1>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground"><Star className="size-4 fill-gold text-gold" /> {dealer.rating.toFixed(1)} • {dealer.location} • {dealer.cars.length} cars in stock</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={whatsappLink(dealer.whatsapp || dealer.phone || "254700000000", `Hi ${dealer.businessName}! I found you on Motiva and I'm looking for a car.`)} target="_blank" rel="noreferrer">
            <Button size="sm" className="bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />WhatsApp dealer</Button>
          </a>
          {dealer.phone && <a href={`tel:${dealer.phone}`}><Button size="sm" variant="outline"><Phone />{dealer.phone}</Button></a>}
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm">{dealer.description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <p className="flex items-center gap-2 font-extrabold"><MapPin className="size-5 text-gold-dark" /> Visit the yard</p>
          <p className="mt-2 text-sm"><b>{dealer.businessName}</b><br />{dealer.location}, Kenya</p>
          <p className="mt-1 text-xs text-muted-foreground">Open Mon–Sat, 8am–6pm. Call ahead so the car is washed, fuelled and ready for your test drive.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dealer.businessName} ${dealer.location} Kenya`)}`} target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline"><Navigation />Get directions</Button>
            </a>
            {dealer.phone && <a href={`tel:${dealer.phone}`}><Button size="sm" variant="secondary"><Phone />{dealer.phone}</Button></a>}
          </div>
        </div>
        <div className="rounded-2xl border border-gold/40 bg-gold/5 p-5">
          <p className="flex items-center gap-2 font-extrabold"><BadgeCheck className="size-5 text-emerald-600" /> What the Verified badge means</p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /> National ID and KRA PIN of the owner checked against the business name.</li>
            <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /> Physical yard visited and geotagged — this address is real.</li>
            <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /> Every listing re-checked for duty status and honest mileage.</li>
            <li className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /> Still verify each car on NTSA TIMS before paying — trust, then confirm.</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dealer.cars.map((c) => <CarCard key={c.id} car={c as never} />)}
      </div>
    </div>
  );
}
