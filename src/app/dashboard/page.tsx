import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default async function DashboardPage() {
  const session = await auth();
  const uid = session!.user!.id!;
  const [active, sold, inquiries, favorites] = await Promise.all([
    prisma.car.count({ where: { sellerId: uid, status: "ACTIVE" } }).catch(() => 0),
    prisma.car.count({ where: { sellerId: uid, status: "SOLD" } }).catch(() => 0),
    prisma.inquiry.count({ where: { car: { sellerId: uid } } }).catch(() => 0),
    prisma.favorite.count({ where: { userId: uid } }).catch(() => 0),
  ]);
  return (
    <div>
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <h1 className="text-2xl font-extrabold">Karibu, {session?.user?.name?.split(" ")[0] ?? "member"} 👋</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Active listings", active, "/dashboard/listings"], ["Sold", sold, "/dashboard/listings"], ["Inquiries received", inquiries, "/dashboard/inquiries"], ["Saved cars", favorites, "/favorites"]].map(([t, v, href]) => (
          <Link key={t as string} href={href as string}><Card className="hover:shadow-md"><CardHeader><CardTitle className="text-sm text-muted-foreground">{t}</CardTitle></CardHeader><CardContent><p className="text-3xl font-extrabold">{v}</p></CardContent></Card></Link>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/sell"><Button>＋ List a car</Button></Link>
        <Link href="/cars"><Button variant="outline">Browse cars</Button></Link>
      </div>
    </div>
  );
}
