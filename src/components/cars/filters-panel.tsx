"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const transmissions = ["AUTOMATIC", "MANUAL", "CVT"];
const fuels = ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"];
const bodies = ["SUV", "SEDAN", "HATCHBACK", "PICKUP", "WAGON", "VAN", "COMMERCIAL"];
const conditions = ["NEW", "FOREIGN_USED", "LOCALLY_USED"];
const sorts = [
  { v: "newest", l: "Newest first" },
  { v: "price-asc", l: "Price: low to high" },
  { v: "price-desc", l: "Price: high to low" },
  { v: "year-desc", l: "Year: newest" },
  { v: "mileage-asc", l: "Mileage: lowest" },
];

export function FiltersPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  const get = (k: string) => sp.get(k) ?? "";

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-1 lg:grid-cols-2">
        <div className="col-span-2"><Input placeholder="Keyword…" defaultValue={get("q")} onChange={(e) => set("q", e.target.value)} aria-label="Keyword" /></div>
        <Select value={get("make")} onChange={(e) => set("make", e.target.value)} aria-label="Make">
          <option value="">All makes</option>
          {siteConfig.makes.map((m) => <option key={m} value={m}>{m}</option>)}
        </Select>
        <Select value={get("location")} onChange={(e) => set("location", e.target.value)} aria-label="Location">
          <option value="">All Kenya</option>
          {siteConfig.locations.map((l) => <option key={l} value={l}>{l}</option>)}
        </Select>
        <Select value={get("bodyType")} onChange={(e) => set("bodyType", e.target.value)} aria-label="Body type">
          <option value="">All types</option>
          {bodies.map((b) => <option key={b} value={b}>{b}</option>)}
        </Select>
        <Select value={get("condition")} onChange={(e) => set("condition", e.target.value)} aria-label="Condition">
          <option value="">Any condition</option>
          {conditions.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
        </Select>
        <Select value={get("transmission")} onChange={(e) => set("transmission", e.target.value)} aria-label="Transmission">
          <option value="">Any gearbox</option>
          {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select value={get("fuelType")} onChange={(e) => set("fuelType", e.target.value)} aria-label="Fuel">
          <option value="">Any fuel</option>
          {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
        </Select>
        <Input placeholder="Min year" inputMode="numeric" defaultValue={get("minYear")} onBlur={(e) => set("minYear", e.target.value)} aria-label="Min year" />
        <Input placeholder="Max price (KES)" inputMode="numeric" defaultValue={get("maxPrice")} onBlur={(e) => set("maxPrice", e.target.value)} aria-label="Max price" />
        <Select value={get("sort") || "newest"} onChange={(e) => set("sort", e.target.value)} aria-label="Sort" className="col-span-2">
          {sorts.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
        </Select>
      </div>
      <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={() => router.push(pathname)}>Clear filters</Button>
    </div>
  );
}
