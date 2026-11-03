import Link from "next/link";
import { Crown, Check, ReceiptText } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayButton } from "@/components/pay/pay-button";
import { formatKES } from "@/lib/utils";

export const metadata = { title: "Dealer plans & billing" };

const plans = [
  {
    id: "free", name: "Starter", price: "Free", per: "forever", tag: "For casual sellers", hot: false,
    features: ["5 active listings", "WhatsApp inquiries", "Basic views stats", "Community support"],
  },
  {
    id: "PLAN_GROWTH", name: "Dealer Growth", price: "KSh 4,999", per: "/month", amount: 4999, tag: "For active yards", hot: true,
    features: ["50 active listings", "Verified yard badge", "1 free Featured boost / month", "Priority WhatsApp support", "Sold + inquiry analytics"],
  },
  {
    id: "PLAN_PREMIUM", name: "Dealer Premium", price: "KSh 9,999", per: "/month", amount: 9999, tag: "For top dealers", hot: false,
    features: ["Unlimited listings", "Homepage dealer spotlight", "4 free Featured boosts / month", "Dedicated account manager", "First access to new features"],
  },
];

const purposeLabel: Record<string, string> = {
  BOOST_FEATURED_7D: "Featured boost — 7 days",
  BOOST_TOP_3D: "Top slot — 3 days",
  PLAN_GROWTH: "Dealer Growth — monthly",
  PLAN_PREMIUM: "Dealer Premium — monthly",
};

export default async function PlansPage() {
  const session = await auth();
  const uid = session!.user!.id!;
  const payments = await prisma.payment.findMany({ where: { userId: uid }, orderBy: { createdAt: "desc" }, take: 20 }).catch(() => []);
  const hasActivePlan = await prisma.payment.count({ where: { userId: uid, purpose: { in: ["PLAN_GROWTH", "PLAN_PREMIUM"] }, status: "COMPLETED" } }).catch(() => 0);

  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Plans & billing" }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">Plans & billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasActivePlan > 0 ? "You have an active paid plan — asante for growing with Motiva." : "You're on the free Starter plan. Upgrade when you're ready."}
          </p>
        </div>
        <Link href="/pricing"><Button variant="outline" size="sm">Compare on pricing page</Button></Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id} className={p.hot ? "border-2 border-gold shadow-lg" : ""}>
            <CardHeader>
              {p.hot && <span className="w-fit rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-navy">MOST POPULAR</span>}
              <CardTitle className="flex items-center gap-2 text-lg"><Crown className="size-5 text-gold-dark" />{p.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{p.tag}</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-navy">{p.price}<span className="text-sm font-normal text-muted-foreground">{p.per}</span></p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {p.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />{f}</li>)}
              </ul>
              {"amount" in p && p.amount ? (
                <div className="mt-4"><PayButton amount={p.amount as number} purpose={p.id} reference={uid} label={p.name} /></div>
              ) : (
                <Link href="/sell"><Button className="mt-4 w-full" variant="outline">Start free</Button></Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ReceiptText className="size-4 text-gold-dark" /> Payment history</CardTitle></CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No payments yet — boosts and plan payments land here with M-Pesa receipts.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead><tr className="border-b text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Item</th><th className="py-2 pr-3">Amount</th><th className="py-2">Status</th>
                </tr></thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 pr-3 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="py-2 pr-3 font-medium">{purposeLabel[p.purpose] ?? p.purpose}</td>
                      <td className="py-2 pr-3 font-bold">{formatKES(p.amount)}</td>
                      <td className="py-2"><Badge variant={p.status === "COMPLETED" ? "success" : p.status === "PENDING" ? "outline" : "secondary"}>{p.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
