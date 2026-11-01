import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const session = await auth();
  const me = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }).catch(() => null) : null;
  if (!me || me.role !== "ADMIN") redirect("/login?next=/admin");

  const [users, pending, cars, dealers] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.car.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.car.count().catch(() => 0),
    prisma.dealer.count().catch(() => 0),
  ]);
  const queue = await prisma.car.findMany({ where: { status: "PENDING" }, take: 20, orderBy: { createdAt: "desc" }, include: { images: true } }).catch(() => []);

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Admin" }]} />
      <h1 className="text-3xl font-extrabold">Admin</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-4">
        {[["Users", users], ["Pending review", pending], ["Total cars", cars], ["Dealers", dealers]].map(([t, v]) => (
          <Card key={t as string}><CardHeader><CardTitle className="text-sm text-muted-foreground">{t}</CardTitle></CardHeader><CardContent><p className="text-3xl font-extrabold">{v}</p></CardContent></Card>
        ))}
      </div>
      <h2 className="mt-8 text-xl font-bold">Review queue</h2>
      <div className="mt-3 grid gap-3">
        {queue.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl border p-3 text-sm">
            <span><b>{c.title}</b> — {c.location}</span>
            <span className="text-muted-foreground">Approve via Prisma Studio: <code>npx prisma studio</code> → set status ACTIVE + verified</span>
          </div>
        ))}
        {queue.length === 0 && <p className="text-muted-foreground">Queue clear. 🎉</p>}
      </div>
    </div>
  );
}
