"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function FavoriteButton({ carId, saved: initial }: { carId: string; saved: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy}
      aria-label="Save car"
      onClick={async () => {
        setBusy(true);
        try {
          const r = await toggleFavoriteAction(carId);
          setSaved(r.saved);
        } finally { setBusy(false); }
      }}
      className={cn("grid size-10 place-items-center rounded-xl border bg-background shadow-sm transition hover:scale-105", saved && "border-red-200 bg-red-50")}
    >
      <Heart className={cn("size-5", saved ? "fill-red-500 text-red-500" : "text-foreground")} />
    </button>
  );
}
