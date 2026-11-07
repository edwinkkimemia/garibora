"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BrandItem = { name: string; count: number; img?: string };

/** Horizontal snap slider for brands — photos where we have them, monograms otherwise. */
export function BrandsSlider({ brands }: { brands: BrandItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 8);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 480, behavior: "smooth" });

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-muted/60 to-transparent md:block" />
      <div ref={ref} onScroll={update} className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-1">
        {brands.map((b) => (
          <Link
            key={b.name}
            href={`/cars?make=${encodeURIComponent(b.name)}`}
            className="group w-40 shrink-0 snap-start overflow-hidden rounded-2xl border bg-card transition hover:border-gold hover:shadow-md"
          >
            {b.img ? (
              <div className="relative h-24"><Image src={b.img} alt={b.name} fill className="object-cover transition group-hover:scale-105" sizes="180px" /></div>
            ) : (
              <div className="grid h-24 place-items-center bg-navy">
                <span className="text-3xl font-extrabold text-gold-light">{b.name.charAt(0)}</span>
              </div>
            )}
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-bold leading-tight">{b.name}</p>
                <p className="text-[11px] text-muted-foreground">{b.count} car{b.count === 1 ? "" : "s"}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-gold-dark" />
            </div>
          </Link>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-muted/60 to-transparent md:block" />
      <div className="absolute -top-11 right-0 hidden gap-2 md:flex">
        <button onClick={() => go(-1)} disabled={!canL} aria-label="Scroll brands left" className={cn("grid size-8 place-items-center rounded-full border bg-card transition", canL ? "hover:border-gold" : "opacity-40")}><ChevronLeft className="size-4" /></button>
        <button onClick={() => go(1)} disabled={!canR} aria-label="Scroll brands right" className={cn("grid size-8 place-items-center rounded-full border bg-card transition", canR ? "hover:border-gold" : "opacity-40")}><ChevronRight className="size-4" /></button>
      </div>
    </div>
  );
}
