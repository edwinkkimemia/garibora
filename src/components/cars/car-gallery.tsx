"use client";

import { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function wmUrl(src: string, w = 1400) {
  return `/api/wm?src=${encodeURIComponent(src)}&w=${w}`;
}

export function CarGallery({ images, title, slug }: { images: { url: string }[]; title: string; slug?: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [{ url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop" }];
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border bg-muted">
        {/* Served pre-watermarked: right-click saves carry the Motiva mark */}
        <Image src={wmUrl(list[active].url)} alt={title} fill className="object-cover" priority sizes="(max-width:768px) 100vw, 800px" unoptimized />
        <a
          href={wmUrl(list[active].url, 1600)}
          download={`${(slug || title).slice(0, 60)}.jpg`}
          className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-navy/85 px-3 py-1.5 text-xs font-bold text-gold-light backdrop-blur-sm transition hover:bg-navy"
        >
          <Download className="size-3.5" /> Save photo
        </a>
      </div>
      {list.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {list.map((im, i) => (
            <button key={i} onClick={() => setActive(i)} className={cn("relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2", i === active ? "border-primary" : "border-transparent opacity-70")}>
              <Image src={im.url} alt={`${title} photo ${i + 1}`} fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
