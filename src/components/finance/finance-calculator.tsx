"use client";

import { useMemo, useState } from "react";
import { Input, Label, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";

export function FinanceCalculator() {
  const [price, setPrice] = useState(2500000);
  const [depositPct, setDepositPct] = useState(20);
  const [rate, setRate] = useState(18);
  const [months, setMonths] = useState(48);

  const { monthly, totalInterest, totalPayable, loan } = useMemo(() => {
    const loanAmt = price * (1 - depositPct / 100);
    const r = rate / 100 / 12;
    const monthlyAmt = r > 0 ? (loanAmt * r) / (1 - Math.pow(1 + r, -months)) : loanAmt / months;
    const payable = monthlyAmt * months + price * (depositPct / 100);
    return { monthly: Math.round(monthlyAmt), totalInterest: Math.round(monthlyAmt * months - loanAmt), totalPayable: Math.round(payable), loan: Math.round(loanAmt) };
  }, [price, depositPct, rate, months]);

  return (
    <Card>
      <CardContent className="grid gap-4 pt-5 md:grid-cols-2">
        <div className="space-y-3">
          <div><Label>Car price (KES)</Label><Input type="number" value={price} min={300000} step={50000} onChange={(e) => setPrice(Number(e.target.value) || 0)} /></div>
          <div><Label>Deposit: {depositPct}% ({formatKES(Math.round(price * depositPct / 100))})</Label>
            <input type="range" min={10} max={60} value={depositPct} onChange={(e) => setDepositPct(Number(e.target.value))} className="w-full accent-[#C9A24B]" /></div>
          <div><Label>Lender</Label>
            <Select value={String(rate)} onChange={(e) => setRate(Number(e.target.value))}>
              <option value={13}>SACCO (~13%)</option>
              <option value={16}>Bank promo (~16%)</option>
              <option value={18}>Bank standard (~18%)</option>
              <option value={22}>Dealer in-house (~22%)</option>
            </Select></div>
          <div><Label>Term: {months} months</Label>
            <input type="range" min={12} max={72} step={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[#C9A24B]" /></div>
        </div>
        <div className="rounded-2xl bg-navy p-5 text-white">
          <p className="text-xs uppercase tracking-wider text-gold-light">Estimated monthly</p>
          <p className="mt-1 text-4xl font-extrabold">{formatKES(monthly)}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-300">Loan amount</dt><dd className="font-bold">{formatKES(loan)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-300">Total interest</dt><dd className="font-bold">{formatKES(totalInterest)}</dd></div>
            <div className="flex justify-between border-t border-white/15 pt-2"><dt className="text-slate-300">Total payable</dt><dd className="font-bold text-gold-light">{formatKES(totalPayable)}</dd></div>
          </dl>
          <p className="mt-3 text-[11px] text-slate-400">Indicative only — reducing balance, before insurance & fees. Keep total car costs under 25% of income.</p>
        </div>
      </CardContent>
    </Card>
  );
}
