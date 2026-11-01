import Image from "next/image";
import Link from "next/link";
import { MapPin, Gauge, Fuel, Cog, BadgeCheck, Heart } from "lucide-react";
import { formatKES, formatMileage } from "@/lib/utils";
import { Badge } from "@/components/ui/card";

type CarCardCar = {
  id: string; slug: string; title: string; make: string; model: string; year: number;
  price: number; mileage: number; fuelType: string; transmission: string; location: string;
  verified: boolean; featured: boolean; negotiable: boolean;
  images: { url: string }[];
};

export function CarCard({ car, view = "grid" }: { car: CarCardCar; view?: "grid" | "list" }) {
  const photo = car.images[0]?.url ?? "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop";
  if (view === "list") {
    return (
      <Link href={`/cars/${car.slug}`} className="flex gap-4 rounded-2xl border bg-card p-3 shadow-sm transition hover:shadow-md">
        <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-56">
          <Image src={photo} alt={car.title} fill className="object-cover" sizes="300px" />
          {car.verified && <span className="absolute left-2 top-2"><Badge variant="success"><BadgeCheck className="size-3" />Verified</Badge></span>}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{car.title}</h3>
          <p className="mt-1 text-lg font-extrabold text-primary">{formatKES(car.price)}{car.negotiable && <span className="ml-1 text-xs font-normal text-muted-foreground">neg</span>}</p>
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Gauge className="size-3" />{formatMileage(car.mileage)}</span>
            <span className="inline-flex items-center gap-1"><Fuel className="size-3" />{car.fuelType}</span>
            <span className="inline-flex items-center gap-1"><Cog className="size-3" />{car.transmission}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{car.location}</span>
          </p>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/cars/${car.slug}`} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={photo} alt={car.title} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width:768px) 100vw, 400px" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {car.verified && <Badge variant="success"><BadgeCheck className="size-3" />Verified</Badge>}
          {car.featured && <Badge>Featured</Badge>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold">{car.title}</h3>
        <p className="mt-1 text-lg font-extrabold text-primary">{formatKES(car.price)}</p>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{car.year}</span><span>•</span><span>{formatMileage(car.mileage)}</span><span>•</span><span>{car.transmission}</span><span>•</span><span>{car.location}</span>
        </p>
      </div>
    </Link>
  );
}
