import Link from "next/link";
import Image from "next/image";
import { GitCompareArrows } from "lucide-react";
import { CompareRemove } from "@/components/compare/compare";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { formatKES, formatMileage } from "@/lib/utils";

export const metadata = { title: "Compare cars side by side" };

// Loose row type over the selected fields below
type C = {
  id: string; title: string; slug: string; price: number; year: number; mileage: number;
  transmission: string; fuelType: string; bodyType: string; condition: string; location: string;
  engineCc: number | null; drive: string | null; color: string | null; verified: boolean;
  dutyPaid: boolean; negotiable: boolean; dealer: { businessName: string } | null;
  images: { url: string }[];
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  const idList = [...new Set((ids || "").split(",").filter(Boolean))].slice(0, 4);
  const cars = (await prisma.car.findMany({
    where: { id: { in: idList }, status: "ACTIVE" },
    include: { images: { take: 1 }, dealer: { select: { businessName: true } } },
  }).catch(() => [])) as unknown as C[];
  const ordered = idList.map((id) => cars.find((c) => c.id === id)).filter((c): c is C => !!c);

  const best = {
    price: ordered.length > 1 ? Math.min(...ordered.map((c) => c.price)) : null,
    mileage: ordered.length > 1 ? Math.min(...ordered.map((c) => c.mileage)) : null,
    year: ordered.length > 1 ? Math.max(...ordered.map((c) => c.year)) : null,
  };

  const cell = (v: string | number, isBest = false) => (
    <span className={`inline-block rounded-lg px-2 py-0.5 ${isBest ? "bg-emerald-50 font-extrabold text-emerald-700" : ""}`}>{v}{isBest ? " ★" : ""}</span>
  );

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Compare" }]} />
      <h1 className="flex items-center gap-2 text-3xl font-extrabold"><GitCompareArrows className="size-7 text-gold-dark" /> Compare cars</h1>
      <p className="mt-1 text-sm text-muted-foreground">Tap <b>Compare</b> on any listing (up to 4) — green ★ marks the winner in each row.</p>

      {ordered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed p-12 text-center">
          <p className="font-bold">Nothing to compare yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Browse cars and tap Compare on the ones you&apos;re deciding between.</p>
          <Link href="/cars"><Button className="mt-4">Browse cars</Button></Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b">
                <th className="w-32 p-3 text-left text-xs uppercase text-muted-foreground">Car</th>
                {ordered.map((c) => (
                  <th key={c.id} className="relative min-w-[180px] p-3 pt-8 text-left align-top">
                    <div className="absolute right-1 top-1"><CompareRemove id={c.id} /></div>
                    <Link href={`/cars/${c.slug}`} className="group">
                      <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                        {c.images[0] && <Image src={c.images[0].url} alt={c.title} fill className="object-cover transition group-hover:scale-105" sizes="250px" />}
                      </span>
                      <span className="mt-2 line-clamp-2 block group-hover:text-gold-dark">{c.title}</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {([
                ["Price", (c: C) => formatKES(c.price), (c: C) => best.price !== null && c.price === best.price],
                ["Year", (c: C) => String(c.year), (c: C) => best.year !== null && c.year === best.year],
                ["Mileage", (c: C) => formatMileage(c.mileage), (c: C) => best.mileage !== null && c.mileage === best.mileage],
                ["Gearbox", (c: C) => c.transmission, (_c: C) => false],
                ["Fuel", (c: C) => c.fuelType, (_c: C) => false],
                ["Body", (c: C) => c.bodyType, (_c: C) => false],
                ["Condition", (c: C) => c.condition.replace("_", " "), (_c: C) => false],
                ["Location", (c: C) => c.location, (_c: C) => false],
                ["Engine", (c: C) => (c.engineCc ? `${c.engineCc.toLocaleString()} cc` : "—"), (_c: C) => false],
                ["Drive", (c: C) => c.drive ?? "—", (_c: C) => false],
                ["Seller", (c: C) => (c.dealer ? `${c.dealer.businessName} (dealer)` : "Private seller"), (_c: C) => false],
                ["Verified", (c: C) => (c.verified ? "✓ Inspected" : "—"), (_c: C) => false],
              ] as Array<[string, (c: C) => string, (c: C) => boolean]>).map(([label, get, isBest]) => (
                <tr key={label} className="border-b last:border-0">
                  <td className="p-3 text-xs font-bold uppercase text-muted-foreground">{label}</td>
                  {ordered.map((c) => <td key={c.id} className="p-3">{cell(get(c), isBest(c))}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
