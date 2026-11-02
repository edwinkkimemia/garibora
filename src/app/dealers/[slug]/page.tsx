import { notFound } from "next/navigation";
import { ShieldCheck, Phone, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { whatsappLink } from "@/lib/utils";

export default async function DealerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dealer = await prisma.dealer.findUnique({ where: { slug }, include: { cars: { where: { status: "ACTIVE" }, include: { images: true } } } }).catch(() => null);
  if (!dealer) notFound();
  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Dealers", href: "/dealers" }, { label: dealer.businessName }]} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold">{dealer.businessName} <ShieldCheck className="size-6 text-green-600" /></h1>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground"><Star className="size-4 fill-gold text-gold" /> {dealer.rating.toFixed(1)} • {dealer.location} • {dealer.cars.length} cars in stock</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={whatsappLink(dealer.whatsapp || dealer.phone || "254700000000", `Hi ${dealer.businessName}! I found you on Motiva and I'm looking for a car.`)} target="_blank" rel="noreferrer">
            <Button size="sm" className="bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />WhatsApp dealer</Button>
          </a>
          {dealer.phone && <a href={`tel:${dealer.phone}`}><Button size="sm" variant="outline"><Phone />{dealer.phone}</Button></a>}
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm">{dealer.description}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dealer.cars.map((c) => <CarCard key={c.id} car={c as never} />)}
      </div>
    </div>
  );
}
