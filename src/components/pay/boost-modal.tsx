"use client";

import { useState } from "react";
import { Zap, X, Crown, ArrowUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayButton } from "@/components/pay/pay-button";
import { formatKES } from "@/lib/utils";

const OPTIONS = [
  { id: "BOOST_FEATURED_7D", name: "Featured — 7 days", price: 999, desc: "Gold badge, top of search, homepage rail and category pages.", icon: Crown },
  { id: "BOOST_TOP_3D", name: "Top slot — 3 days", price: 499, desc: "Pinned to the top of search results in your town for 72 hours.", icon: ArrowUp },
];

/** Boost flow: option cards + M-Pesa STK in a focused modal. */
export function BoostModal({ carId, carTitle }: { carId: string; carTitle: string }) {
  const [open, setOpen] = useState(false);
  const [opt, setOpt] = useState(OPTIONS[0]);

  if (!open) {
    return (
      <Button size="sm" className="bg-gold text-navy hover:bg-gold-dark hover:text-white" onClick={() => setOpen(true)}>
        <Zap />Boost
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/70 p-4 backdrop-blur-sm" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Boost listing">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl md:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-lg font-extrabold"><Zap className="size-5 text-gold-dark" />Boost this car</p>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{carTitle}</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-muted"><X className="size-4" /></button>
        </div>

        <div className="mt-4 grid gap-2">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => setOpt(o)}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${opt.id === o.id ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"}`}
            >
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${opt.id === o.id ? "bg-navy text-gold-light" : "bg-muted text-navy"}`}><o.icon className="size-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">{o.name}</span>
                  <span className="text-sm font-extrabold text-navy">{formatKES(o.price)}</span>
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{o.desc}</span>
              </span>
              {opt.id === o.id && <Check className="size-4 shrink-0 text-gold-dark" />}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-muted/60 p-3">
          <PayButton key={opt.id} amount={opt.price} purpose={opt.id} reference={carId} label={opt.name} />
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">Secure M-Pesa STK push • Activates in minutes • Receipt by SMS</p>
      </div>
    </div>
  );
}
