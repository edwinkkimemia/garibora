"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { formatKES } from "@/lib/utils";

type Phase = "idle" | "sending" | "waiting" | "success" | "failed";

/** M-Pesa STK push button: phone in → PIN on phone → polls for the result. */
export function PayButton({ amount, purpose, reference, label }: {
  amount: number; purpose: string; reference?: string; label?: string;
}) {
  const [phone, setPhone] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const poll = (checkoutId: string) => {
    const started = Date.now();
    let ticks = 0;
    timer.current = setInterval(async () => {
      ticks++;
      // Every ~20s, re-query Safaricom live so completion is caught
      // even when callbacks can't reach us (firewalls, tunnels, delays).
      const live = ticks % 5 === 0 ? "&refresh=1" : "";
      if (Date.now() - started > 120_000) {
        if (timer.current) clearInterval(timer.current);
        // One live re-query before giving up (covers delayed callbacks)
        try {
          const r = await fetch(`/api/mpesa/status?checkoutId=${encodeURIComponent(checkoutId)}&refresh=1`);
          const d = (await r.json()) as { status?: string };
          if (d.status === "COMPLETED") { setPhase("success"); return; }
          if (d.status === "CANCELLED") { setPhase("failed"); setError("You cancelled the request. Try again when ready."); return; }
        } catch { /* fall through */ }
        setPhase("failed");
        setError("Timed out waiting for M-Pesa. Already paid? Tap Retry — completed payments are detected. Otherwise no money left your account.");
        return;
      }
      try {
        // Every ~20s, re-query Safaricom live so completion is caught even when callbacks are blocked.
        const live = ticks % 5 === 0 ? "&refresh=1" : "";
        const r = await fetch(`/api/mpesa/status?checkoutId=${encodeURIComponent(checkoutId)}${live}`);
        const d = (await r.json()) as { status?: string };
        if (d.status === "COMPLETED") {
          if (timer.current) clearInterval(timer.current);
          setPhase("success");
        } else if (d.status === "FAILED" || d.status === "CANCELLED") {
          if (timer.current) clearInterval(timer.current);
          setPhase("failed");
          setError(d.status === "CANCELLED" ? "You cancelled the request. Try again when ready." : "Payment failed. No money left your M-Pesa — try again.");
        }
      } catch { /* keep polling */ }
    }, 4000);
  };

  const start = async () => {
    setError("");
    if (!phone.trim()) { setError("Enter your M-Pesa number first."); return; }
    setPhase("sending");
    try {
      const r = await fetch("/api/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), purpose, reference: reference || "general" }),
      });
      const d = (await r.json()) as { ok?: boolean; checkoutRequestId?: string; error?: string };
      if (!d.ok || !d.checkoutRequestId) throw new Error(d.error || "Could not start payment.");
      setPhase("waiting");
      poll(d.checkoutRequestId);
    } catch (e) {
      setPhase("failed");
      setError(e instanceof Error ? e.message : "Could not start payment.");
    }
  };

  if (phase === "success") {
    return (
      <div className="rounded-xl bg-emerald-50 p-4 text-center">
        <CheckCircle2 className="mx-auto size-8 text-emerald-600" />
        <p className="mt-2 font-extrabold text-emerald-800">Payment received!</p>
        <p className="mt-1 text-sm text-emerald-700">We&apos;ll activate {label || "your order"} within minutes — watch your WhatsApp for confirmation.</p>
      </div>
    );
  }

  return (
    <div>
      {phase === "idle" || phase === "failed" ? (
        <div className="space-y-2">
          <div>
            <Label htmlFor={`mpesa-${purpose}`}>M-Pesa number</Label>
            <Input id={`mpesa-${purpose}`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0722…" inputMode="tel" />
          </div>
          <Button onClick={start} className="w-full bg-[#25D366] text-white hover:bg-[#1eb85a]"><Smartphone />Pay {formatKES(amount)}</Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-muted p-3 text-sm">
          <Loader2 className="size-4 animate-spin text-gold-dark" />
          {phase === "sending" ? "Contacting M-Pesa…" : "Check your phone — enter your M-Pesa PIN to complete."}
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
