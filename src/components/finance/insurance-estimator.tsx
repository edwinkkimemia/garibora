"use client";

import { useMemo, useState } from "react";
import { Input, Label, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";

export function InsuranceEstimator() {
  const [value, setValue] = useState(2500000);
  const [cover, setCover] = useState<"comp" | "tpo">("comp");
  const [engine, setEngine] = useState(1500);

  const premium = useMemo(() => {
    if (cover === "tpo") {
      const base = engine <= 1500 ? 8500 : engine <= 2000 ? 10500 : 13000;
      return Math.round(base * 1.16); // + levies
    }
    return Math.max(50000, Math.round(value * 0.045 * 1.16));
  }, [value, cover, engine]);

  return (
    <Card>
      <CardContent className="grid gap-4 pt-5 md:grid-cols-2">
        <div className="space-y-3">
          <div><Label>Car value (KES)</Label><Input type="number" value={value} min={300000} step={50000} onChange={(e) => setValue(Number(e.target.value) || 0)} /></div>
          <div><Label>Cover</Label>
            <Select value={cover} onChange={(e) => setCover(e.target.value as "comp" | "tpo")}>
              <option value="comp">Comprehensive (own damage + theft + third party)</option>
              <option value="tpo">Third party only (legal minimum)</option>
            </Select></div>
          {cover === "tpo" && (
            <div><Label>Engine size</Label>
              <Select value={String(engine)} onChange={(e) => setEngine(Number(e.target.value))}>
                <option value={1300}>Up to 1500cc</option>
                <option value={1800}>1501 – 2000cc</option>
                <option value={2500}>Above 2000cc</option>
              </Select></div>
          )}
        </div>
        <div className="rounded-2xl bg-navy p-5 text-white">
          <p className="text-xs uppercase tracking-wider text-gold-light">Estimated yearly premium</p>
          <p className="mt-1 text-4xl font-extrabold">{formatKES(premium)}</p>
          <p className="mt-2 text-sm text-slate-300">{cover === "comp" ? "≈ 4.5% of value incl. levies. Windscreen, political violence & excess protector available as add-ons." : "Legal minimum to drive on Kenyan roads. Covers others — not your car."}</p>
          <p className="mt-3 text-[11px] text-slate-400">Indicative only. Final quotes depend on use (private/PSV), driver history and insurer.</p>
        </div>
      </CardContent>
    </Card>
  );
}
