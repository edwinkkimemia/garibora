"use client";

import { useCallback, useEffect, useState } from "react";
import { GitCompareArrows, X } from "lucide-react";

const KEY = "motiva-compare";
export const MAX_COMPARE = 3;

export function getCompareIds(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((x) => typeof x === "string").slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

function setCompareIds(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("compare-changed"));
}

export function toggleCompare(id: string): "added" | "removed" | "full" {
  const ids = getCompareIds();
  if (ids.includes(id)) {
    setCompareIds(ids.filter((x) => x !== id));
    return "removed";
  }
  if (ids.length >= MAX_COMPARE) return "full";
  setCompareIds([...ids, id]);
  return "added";
}

/** Compare toggle shown on each car card. */
export function CompareButton({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);
  const [full, setFull] = useState(false);
  const sync = useCallback(() => {
    const ids = getCompareIds();
    setActive(ids.includes(id));
    setFull(!ids.includes(id) && ids.length >= MAX_COMPARE);
  }, [id]);
  useEffect(() => {
    sync();
    window.addEventListener("compare-changed", sync);
    return () => window.removeEventListener("compare-changed", sync);
  }, [sync]);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        const r = toggleCompare(id);
        if (r === "full") alert("Compare holds 3 cars — remove one first.");
        sync();
      }}
      title={active ? "Remove from compare" : full ? "Compare is full (3)" : `Compare ${title}`}
      aria-pressed={active}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${active ? "bg-navy text-gold-light" : "bg-muted text-slate-600 hover:bg-navy/10"}`}
    >
      <GitCompareArrows className="size-3.5" />{active ? "Added ✓" : "Compare"}
    </button>
  );
}

/** Floating tray — appears whenever cars are queued for comparison. */
export function CompareTray() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(getCompareIds());
    sync();
    window.addEventListener("compare-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("compare-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  if (ids.length === 0) return null;
  return (
    <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0">
      <div className="flex items-center gap-2 rounded-2xl border border-gold/40 bg-navy px-4 py-2.5 text-white shadow-2xl">
        <span className="text-sm font-bold">Compare ({ids.length})</span>
        <a href={`/compare?ids=${ids.join(",")}`} className="rounded-xl bg-gold px-4 py-1.5 text-sm font-extrabold text-navy transition hover:bg-gold-dark hover:text-white">View</a>
        <button onClick={() => setCompareIds([])} aria-label="Clear compare" className="grid size-7 place-items-center rounded-full hover:bg-white/10"><X className="size-4" /></button>
      </div>
    </div>
  );
}
