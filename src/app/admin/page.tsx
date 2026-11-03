import Link from "next/link";
import { ArrowRight, CarFront, Users, BadgeCheck, CreditCard, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";

export const metadata = { title: "Admin overview" };

const dayMs = 24 * 3600 * 1000;
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

export default async function AdminPage() {
  const since7 = new Date(Date.now() - 7 * dayMs);
  const since30 = new Date(Date.now() - 30 * dayMs);
  const [
    userCount, pendingCars, pendingParts, pendingSellers, carCount, dealerCount, partCount,
    revenue, revenueMonth, completedCount, failedCount,
    byStatus, signups, recentPayments, recentUsers, recentInquiries,
  ] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.car.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.part.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.user.count({ where: { idNumber: { not: null }, idVerified: false } }).catch(() => 0),
    prisma.car.count().catch(() => 0),
    prisma.dealer.count().catch(() => 0),
    prisma.part.count().catch(() => 0),
    prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
    prisma.payment.aggregate({ where: { status: "COMPLETED", createdAt: { gte: since30 } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
    prisma.payment.count({ where: { status: "COMPLETED" } }).catch(() => 0),
    prisma.payment.count({ where: { status: { in: ["FAILED", "CANCELLED"] } } }).catch(() => 0),
    prisma.car.groupBy({ by: ["status"], _count: true }).catch(() => [] as { status: string; _count: number }[]),
    prisma.user.findMany({ where: { createdAt: { gte: since7 } }, select: { createdAt: true } }).catch(() => [] as { createdAt: Date }[]),
    prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { name: true, email: true } } } }).catch(() => []),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { name: true, email: true, role: true, createdAt: true } }).catch(() => []),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { car: { select: { title: true } }, part: { select: { title: true } } } }).catch(() => []),
  ]);

  // Signups per day, last 7 days
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = startOfDay(new Date(Date.now() - i * dayMs));
    const next = new Date(d.getTime() + dayMs);
    days.push({ label: d.toLocaleDateString("en-KE", { weekday: "short" }), count: signups.filter((s) => s.createdAt >= d && s.createdAt < next).length });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));
  const totalListings = byStatus.reduce((a, g) => a + g._count, 0) || 1;

  const cards: { t: string; v: string; href: string; sub?: string }[] = [
    { t: "M-Pesa collected (all time)", v: formatKES(revenue._sum.amount ?? 0), href: "/admin/payments", sub: `${completedCount} completed • ${failedCount} failed` },
    { t: "Collected · last 30 days", v: formatKES(revenueMonth._sum.amount ?? 0), href: "/admin/payments" },
    { t: "Pending review", v: String(pendingCars + pendingParts), href: "/admin/listings", sub: `${pendingCars} cars • ${pendingParts} parts` },
    { t: "Sellers to verify", v: String(pendingSellers), href: "/admin/users" },
    { t: "Total users", v: String(userCount), href: "/admin/users", sub: `${carCount} cars • ${dealerCount} dealers • ${partCount} parts` },
  ];

  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Admin" }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">Command centre</h1>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })} • Everything that needs you is below.</p>
        </div>
        <Link href="/admin/listings" className="text-sm font-bold text-gold-dark hover:underline">Review queue →</Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.t} href={c.href}>
            <Card className="h-full transition hover:border-gold hover:shadow-md">
              <CardHeader className="pb-1"><CardTitle className="text-xs font-medium text-muted-foreground">{c.t}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-extrabold">{c.v}</p>
                {c.sub && <p className="mt-0.5 text-xs text-muted-foreground">{c.sub}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Listings health */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CarFront className="size-4 text-gold-dark" /> Listings by status</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {byStatus.map((g) => (
              <div key={g.status} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 font-semibold">{g.status}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-gradient-to-r from-navy to-gold" style={{ width: `${Math.max(4, Math.round((g._count / totalListings) * 100))}%` }} /></span>
                <span className="w-10 text-right font-bold">{g._count}</span>
              </div>
            ))}
            {byStatus.length === 0 && <p className="text-sm text-muted-foreground">No listings yet.</p>}
          </CardContent>
        </Card>
        {/* Signups */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="size-4 text-gold-dark" /> Signups · last 7 days</CardTitle></CardHeader>
          <CardContent>
            <div className="flex h-28 items-end gap-1.5">
              {days.map((d) => (
                <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[11px] font-bold">{d.count > 0 ? d.count : ""}</span>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-navy to-gold" style={{ height: `${Math.max(4, Math.round((d.count / maxDay) * 100))}%`, minHeight: 4 }} />
                  <span className="text-[10px] text-muted-foreground">{d.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Action queue */}
        <Card className="border-gold/50">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Clock className="size-4 text-gold-dark" /> Needs your eyes</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <Link href="/admin/listings" className="flex items-center justify-between rounded-xl border p-3 hover:border-gold"><span><b>{pendingCars + pendingParts}</b> listings awaiting review</span><ArrowRightIcon /></Link>
            <Link href="/admin/users" className="flex items-center justify-between rounded-xl border p-3 hover:border-gold"><span><b>{pendingSellers}</b> sellers awaiting verification</span><ArrowRightIcon /></Link>
            <Link href="/admin/payments" className="flex items-center justify-between rounded-xl border p-3 hover:border-gold"><span><b>{failedCount}</b> failed / cancelled payments to glance at</span><ArrowRightIcon /></Link>
          </CardContent>
        </Card>
        {/* Recent payments */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CreditCard className="size-4 text-gold-dark" /> Latest payments</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {recentPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2">
                <span className="min-w-0"><span className="block truncate font-semibold">{p.user?.name ?? p.phone}</span><span className="text-xs text-muted-foreground">{p.purpose.replace(/_/g, " ")}</span></span>
                <span className="text-right"><span className="block font-extrabold">{formatKES(p.amount)}</span><Badge variant={p.status === "COMPLETED" ? "success" : p.status === "PENDING" ? "outline" : "secondary"}>{p.status}</Badge></span>
              </div>
            ))}
            {recentPayments.length === 0 && <p className="text-sm text-muted-foreground">No payments yet.</p>}
          </CardContent>
        </Card>
        {/* New users + inquiries */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BadgeCheck className="size-4 text-gold-dark" /> Fresh activity</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {recentUsers.slice(0, 3).map((u) => (
              <p key={u.email} className="truncate"><b>{u.name}</b> joined as {u.role} <span className="text-muted-foreground">• {new Date(u.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</span></p>
            ))}
            {recentInquiries.slice(0, 3).map((q) => (
              <p key={q.id} className="truncate text-muted-foreground">Inquiry on <b className="text-foreground">{q.car?.title ?? q.part?.title ?? "a listing"}</b></p>
            ))}
            {recentUsers.length === 0 && recentInquiries.length === 0 && <p className="text-sm text-muted-foreground">Quiet… for now.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return <span aria-hidden>→</span>;
}
