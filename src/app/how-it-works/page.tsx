import Link from "next/link";
import { Search, MessageCircle, ClipboardCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: Search, t: "1. Search & compare", d: "Filter by make, price in KES, year, mileage, location. Save favourites." },
  { icon: MessageCircle, t: "2. Chat on WhatsApp", d: "Contact the seller instantly. Ask for logbook + duty receipt photos." },
  { icon: ClipboardCheck, t: "3. Inspect & verify", d: "View in daylight, check NTSA TIMS, test-drive. Look for the Verified badge." },
  { icon: KeyRound, t: "4. Pay & transfer", d: "Pay via bank/M-Pesa to the logbook owner, then transfer on NTSA together." },
];

export default function HowItWorksPage() {
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-4xl font-extrabold">How GariBora works</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {steps.map((s) => (
          <div key={s.t} className="rounded-2xl border bg-card p-5">
            <s.icon className="size-8 text-primary" />
            <p className="mt-3 font-bold">{s.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Link href="/cars"><Button>Browse cars</Button></Link>
        <Link href="/sell"><Button variant="outline">Sell your car</Button></Link>
      </div>
    </div>
  );
}
