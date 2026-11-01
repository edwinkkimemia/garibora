import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CarCard } from "@/components/cars/car-card";
import { ShieldCheck } from "lucide-react";

export default async function DealerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dealer = await prisma.dealer.findUnique({ where: { slug }, include: { cars: { where: { status: "ACTIVE" }, include: { images: true } } } }).catch(() => null);
  if (!dealer) notFound();
  return (
    <div className="container py-8">
      <h1 className="flex items-center gap-2 text-3xl font-extrabold">{dealer.businessName} <ShieldCheck className="size-6 text-green-600" /></h1>
      <p className="mt-1 text-muted-foreground">{dealer.location} • ★ {dealer.rating.toFixed(1)} • {dealer.cars.length} cars in stock</p>
      <p className="mt-3 max-w-2xl text-sm">{dealer.description}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dealer.cars.map((c) => <CarCard key={c.id} car={c as never} />)}
      </div>
    </div>
  );
}
