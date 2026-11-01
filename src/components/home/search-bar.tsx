"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { siteConfig } from "@/config/site";

const field = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";
const label = "mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [make, setMake] = useState(params.get("make") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const sp = new URLSearchParams();
        if (q) sp.set("q", q);
        if (make) sp.set("make", make);
        if (maxPrice) sp.set("maxPrice", maxPrice);
        if (location) sp.set("location", location);
        router.push(`/cars?${sp.toString()}`);
      }}
      className="rounded-2xl bg-white p-3 text-slate-900 shadow-2xl md:p-4"
    >
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div>
          <label className={label} htmlFor="hero-q">Search</label>
          <Input id="hero-q" placeholder="Try Prado, Note, Hilux…" value={q} onChange={(e) => setQ(e.target.value)} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="hero-make">Make</label>
          <Select id="hero-make" value={make} onChange={(e) => setMake(e.target.value)} className={field}>
            <option value="">All makes</option>
            {siteConfig.makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>
        <div>
          <label className={label} htmlFor="hero-price">Max price</label>
          <Select id="hero-price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={field}>
            <option value="">Any price</option>
            <option value="1500000">Under KSh 1.5M</option>
            <option value="2500000">Under KSh 2.5M</option>
            <option value="4000000">Under KSh 4M</option>
            <option value="7000000">Under KSh 7M</option>
          </Select>
        </div>
        <div>
          <label className={label} htmlFor="hero-loc">Location</label>
          <Select id="hero-loc" value={location} onChange={(e) => setLocation(e.target.value)} className={field}>
            <option value="">All Kenya</option>
            {siteConfig.locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full bg-gold text-navy hover:bg-gold-dark hover:text-white md:w-auto">
            <Search />Search
          </Button>
        </div>
      </div>
    </form>
  );
}
