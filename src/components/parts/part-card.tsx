import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/card";
import { Watermark } from "@/components/ui/watermark";
import { formatKES } from "@/lib/utils";

export function partLabel(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

type PartCardPart = {
  id: string; slug: string; title: string; price: number;
  location: string; category: string; condition: string;
  images: { url: string }[];
};

export function PartCard({ part }: { part: PartCardPart }) {
  return (
    <Link href={`/parts/${part.slug}`} className="group overflow-hidden rounded-2xl border bg-white text-slate-900 transition hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {part.images[0] && <Image src={part.images[0].url} alt={part.title} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="300px" />}
        {part.images[0] && <Watermark url={part.images[0].url} size="sm" />}
        <span className="absolute left-2 top-2"><Badge variant="outline" className="bg-white/90">{partLabel(part.category)}</Badge></span>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-bold">{part.title}</h3>
        <p className="mt-1 font-extrabold text-navy">{formatKES(part.price)}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="size-3" />{part.location} • {partLabel(part.condition)}</p>
      </div>
    </Link>
  );
}
