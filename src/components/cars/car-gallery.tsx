"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CarGallery({ images, title }: { images: { url: string }[]; title: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [{ url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop" }];
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border">
        <Image src={list[active].url} alt={title} fill className="object-cover" priority sizes="(max-width:768px) 100vw, 800px" />
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
