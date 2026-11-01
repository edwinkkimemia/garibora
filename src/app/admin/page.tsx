import Link from "next/link";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin overview" };

export default async function AdminPage() {
  const [users, pending, cars, dealers, parts, pendingSellers] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.car.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.car.count().catch(() => 0),
    prisma.dealer.count().catch(() => 0),
    prisma.part.count().catch(() => 0),
    prisma.user.count({ where: { idNumber: { not: null }, idVerified: false } }).catch(() => 0),
  ]);
  const stats: [string, number, string][] = [
    ["Pending listings", pending, "/admin/listings"],
    ["Seller verifications", pendingSellers, "/admin/users"],
    ["Total users", users, "/admin/users"],
    ["Total cars", cars, "/cars"],
    ["Dealers", dealers, "/dealers"],
    ["Parts", parts, "/parts"],
  ];
  return (
    <div>
      <Breadcrumbs items={[{ label: "Admin" }]} />
      <h1 className="text-3xl font-extrabold">Admin overview</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(([t, v, href]) => (
          <Link key={t as string} href={href as string}><Card className="transition hover:border-gold hover:shadow-md"><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">{t}</CardTitle></CardHeader><CardContent><p className="text-3xl font-extrabold">{v}</p></CardContent></Card></Link>
        ))}
      </div>
      {(pending > 0 || pendingSellers > 0) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {pending > 0 && <Link href="/admin/listings"><Button>Review {pending} listings →</Button></Link>}
          {pendingSellers > 0 && <Link href="/admin/users"><Button variant="outline">Verify {pendingSellers} sellers →</Button></Link>}
        </div>
      )}
    </div>
  );
}
