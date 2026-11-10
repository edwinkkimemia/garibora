import Image from "next/image";
import Link from "next/link";
import { MapPin, Gauge, Fuel, Cog, BadgeCheck, Heart, ArrowLeftRight, Landmark } from "lucide-react";
import { formatKES, formatMileage } from "@/lib/utils";
import { Badge } from "@/components/ui/card";
import { Watermark } from "@/components/ui/watermark";
import { Avatar } from "@/components/ui/avatar";
import { CompareButton } from "@/components/compare/compare";

type CarCardCar = {
  id: string; slug: string; title: string; make: string; model: string; year: number;
  price: number; mileage: number; fuelType: string; transmission: string; location: string;
  verified: boolean; featured: boolean; negotiable: boolean;
  tradeInAccepted?: boolean | null; financingAvailable?: boolean | null;
  dailyRate?: number | null; listingType?: string;
  dealer?: { businessName: string; logoUrl: string | null } | null;
  seller?: { name: string | null; image: string | null } | null;
  images: { url: string }[];
};

function SellerMark({ car }: { car: CarCardCar }) {
  if (car.dealer) {
    return (
      <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-navy">
        <Avatar src={car.dealer.logoUrl} name={car.dealer.businessName} className="size-5" />
        <span className="truncate">{car.dealer.businessName} <span className="font-medium text-muted-foreground">• Dealer</span></span>
        <BadgeCheck className="size-3.5 shrink-0 text-gold-dark" />
      </p>
    );
  }
  // dealer: null (explicitly loaded) = independent seller; undefined = unknown source
  if ("dealer" in car && car.dealer === null) {
    const name = car.seller?.name || "Private seller";
    return (
      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <Avatar src={car.seller?.image} name={name} className="size-5" />
        <span className="truncate">{name}</span>
        <BadgeCheck className="size-3.5 shrink-0 text-emerald-600" />
      </p>
    );
  }
  return null;
}

export function CarCard({ car, view = "grid" }: { car: CarCardCar; view?: "grid" | "list" }) {
  const photo = car.images[0]?.url ?? "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop";
  const perks = (
    <>
      {car.tradeInAccepted ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><ArrowLeftRight className="size-3" />Trade-in</span> : null}
      {car.financingAvailable ? <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700"><Landmark className="size-3" />Finance</span> : null}
    </>
  );
  if (view === "list") {
    return (
      <Link href={`/cars/${car.slug}`} className="flex gap-4 rounded-2xl border bg-white p-3 text-slate-900 shadow-sm transition hover:shadow-md">
        <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-56">
          <Image src={photo} alt={car.title} fill className="object-cover" sizes="300px" />
          <Watermark url={photo} size="sm" />
          {car.verified && <span className="absolute left-2 top-2"><Badge variant="success"><BadgeCheck className="size-3" />Verified</Badge></span>}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900">{car.title}</h3>
          <SellerMark car={car} />
          <p className="mt-1 text-lg font-extrabold text-navy">{formatKES(car.price)}{car.negotiable && <span className="ml-1 text-xs font-normal text-slate-500">neg</span>}</p>
          {(car.tradeInAccepted || car.financingAvailable) && <p className="mt-1.5 flex flex-wrap gap-1.5">{perks}</p>}
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Gauge className="size-3" />{formatMileage(car.mileage)}</span>
            <span className="inline-flex items-center gap-1"><Fuel className="size-3" />{car.fuelType}</span>
            <span className="inline-flex items-center gap-1"><Cog className="size-3" />{car.transmission}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{car.location}</span>
          </p>
          <div className="mt-2">
            <CompareButton id={car.id} title={car.title} />
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/cars/${car.slug}`} className="group overflow-hidden rounded-2xl border bg-white text-slate-900 shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={photo} alt={car.title} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width:768px) 100vw, 400px" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {car.verified && <Badge variant="success"><BadgeCheck className="size-3" />Verified</Badge>}
          {car.featured && <Badge>Featured</Badge>}
        </div>
        {car.dailyRate ? (
          <span className="absolute bottom-2 right-2 rounded-full bg-navy/90 px-2.5 py-1 text-[11px] font-bold text-gold-light backdrop-blur-sm">
            {formatKES(car.dailyRate)}/day hire
          </span>
        ) : <Watermark url={photo} />}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-slate-900">{car.title}</h3>
        <SellerMark car={car} />
        {car.dailyRate && car.listingType === "RENT" ? (
          <p className="mt-1 text-lg font-extrabold text-navy">{formatKES(car.dailyRate)}<span className="text-sm font-semibold text-slate-500">/day</span> <span className="ml-1 rounded-full bg-navy px-2 py-0.5 text-[11px] font-bold text-gold-light">For hire</span></p>
        ) : car.dailyRate ? (
          <p className="mt-1 text-lg font-extrabold text-navy">{formatKES(car.dailyRate)}<span className="text-sm font-semibold text-slate-500">/day</span> <span className="ml-1 text-xs font-normal text-slate-500">• {formatKES(car.price)} to buy</span></p>
        ) : (
          <p className="mt-1 text-lg font-extrabold text-navy">{formatKES(car.price)}</p>
        )}
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{car.year}</span><span>•</span><span>{formatMileage(car.mileage)}</span><span>•</span><span>{car.transmission}</span><span>•</span><span>{car.location}</span>
        </p>
        {(car.tradeInAccepted || car.financingAvailable) && <p className="mt-1.5 flex flex-wrap gap-1.5">{perks}</p>}
        <div className="mt-2">
          <CompareButton id={car.id} title={car.title} />
        </div>
      </div>
    </Link>
  );
}
