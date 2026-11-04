"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BellPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveSearchAction } from "@/lib/actions";

const LABELS: Record<string, string> = {
  q: "“", make: "", model: "", bodyType: "", fuelType: "", condition: "",
  location: "", maxPrice: "≤KSh ", minYear: "≥", transmission: "", maxMileage: "≤",
};

/** One-tap save of the current filter set for match alerts. */
export function SaveSearchButton() {
  const sp = useSearchParams();
  const [saved, setSaved] = useState(false);
  const [state, action, pending] = useActionState(async (_: unknown, fd: FormData) => {
    const r = await saveSearchAction(_, fd);
    if ((r as { ok?: boolean })?.ok) setSaved(true);
    return r;
  }, {} as { error?: string; ok?: boolean });

  const entries = [...sp.entries()].filter(([k, v]) => v && !["sort", "page"].includes(k));
  if (entries.length === 0) return null;

  const filters: Record<string, string> = Object.fromEntries(entries);
  const name = entries
    .map(([k, v]) => (k === "q" ? `“${v}”` : k === "maxPrice" ? `≤KSh ${(Number(v) / 1000).toFixed(0)}K` : (LABELS[k] ?? "") + v.replace(/_/g, " ")))
    .slice(0, 3)
    .join(" • ");

  if (saved) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><Check className="size-3.5" /> Alert on</span>;
  }
  return (
    <form action={action} className="inline">
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="filters" value={JSON.stringify(filters)} />
      <Button type="submit" size="sm" variant="outline" disabled={pending} title="Get notified of new matching cars">
        <BellPlus />{pending ? "Saving…" : "Save search"}
      </Button>
      {state?.error && <span className="ml-2 text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
