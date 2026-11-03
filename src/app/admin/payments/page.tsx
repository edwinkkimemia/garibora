import Link from "next/link";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatKES } from "@/lib/utils";

export const metadata = { title: "Admin — payments" };

const purposes: Record<string, string> = {
  BOOST_FEATURED_7D: "Featured boost — 7 days",
  BOOST_TOP_3D: "Top slot — 3 days",
  PLAN_GROWTH: "Dealer Growth — monthly",
  PLAN_PREMIUM: "Dealer Premium — monthly",
};

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams;
  const active = ["PENDING", "COMPLETED", "FAILED", "CANCELLED"].includes(status || "") ? status! : "";
  const query = (q || "").trim();
  const where = {
    ...(active ? { status: active as never } : {}),
    ...(query ? { OR: [{ phone: { contains: query } }, { purpose: { contains: query, mode: "insensitive" } }] } : {}),
  };
  const [payments, totals] = await Promise.all([
    prisma.payment.findMany({ where: where as never, orderBy: { createdAt: "desc" }, take: 50, include: { user: { select: { name: true, email: true } } } }).catch(() => []),
    prisma.payment.groupBy({ by: ["status"], _sum: { amount: true }, _count: true }).catch(() => [] as { status: string; _sum: { amount: number | null }; _count: number }[]),
  ]);
  const sum = (s: string) => totals.find((t) => t.status === s)?._sum.amount ?? 0;
  const count = (s: string) => totals.find((t) => t.status === s)?._count ?? 0;
  const qs = (over: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (active) sp.set("status", active);
    if (query) sp.set("q", query);
    Object.entries(over).forEach(([k, v]) => { if (v) sp.set(k, v); else sp.delete(k); });
    return `/admin/payments?${sp.toString()}`;
  };

  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Admin", href: "/admin" }, { label: "Payments" }]} />
      <h1 className="text-2xl font-extrabold md:text-3xl">M-Pesa payments</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Collected</p><p className="text-2xl font-extrabold text-emerald-700">{formatKES(sum("COMPLETED"))}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Pending</p><p className="text-2xl font-extrabold">{count("PENDING")} open</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Failed / cancelled</p><p className="text-2xl font-extrabold">{count("FAILED") + count("CANCELLED")}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Activate manually?</p><p className="text-xs">Completed a bank transfer instead? Use <Link href="/admin/listings" className="font-bold text-gold-dark hover:underline">review queue →</Link></p></CardContent></Card>
      </div>

      <form className="mt-4 flex flex-wrap gap-2" action="/admin/payments" method="get">
        <Input name="q" defaultValue={query} placeholder="Search phone or purpose…" className="w-64" />
        {active && <input type="hidden" name="status" value={active} />}
        <Button type="submit" size="sm" variant="secondary">Search</Button>
        {(query || active) && <Link href="/admin/payments"><Button size="sm" variant="ghost">Clear</Button></Link>}
      </form>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link href={qs({ status: "" })}><Button size="sm" variant={!active ? "default" : "outline"}>All</Button></Link>
        {["PENDING", "COMPLETED", "FAILED", "CANCELLED"].map((s) => (
          <Link key={s} href={qs({ status: active === s ? "" : s })}><Button size="sm" variant={active === s ? "default" : "outline"}>{s} ({count(s)})</Button></Link>
        ))}
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead><tr className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
            <th className="p-3">When</th><th className="p-3">Payer</th><th className="p-3">Item</th><th className="p-3">Amount</th><th className="p-3">Checkout</th><th className="p-3">Status</th>
          </tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                <td className="p-3"><p className="font-semibold">{p.user?.name ?? "Guest"}</p><p className="text-xs text-muted-foreground">{p.phone}{p.user ? ` • ${p.user.email}` : ""}</p></td>
                <td className="p-3">{purposes[p.purpose] ?? p.purpose}<p className="text-xs text-muted-foreground">{p.reference}</p></td>
                <td className="p-3 font-extrabold">{formatKES(p.amount)}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{p.checkoutRequestId?.slice(-8) ?? "—"}</td>
                <td className="p-3"><Badge variant={p.status === "COMPLETED" ? "success" : p.status === "PENDING" ? "outline" : "secondary"}>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">No payments match.</p>}
      </div>
    </div>
  );
}
