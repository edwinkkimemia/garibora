import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";
import { markSoldAction, deleteListingAction } from "@/lib/actions";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default async function ListingsPage() {
  const session = await auth();
  const cars = await prisma.car.findMany({
    where: { sellerId: session!.user!.id! }, include: { images: true },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);
  return (
    <div>
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "My listings" }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">My listings ({cars.length})</h1>
        <Link href="/sell"><Button size="sm">＋ New</Button></Link>
      </div>
      <div className="mt-5 grid gap-4">
        {cars.map((c) => (
          <div key={c.id} className="flex gap-4 rounded-2xl border bg-card p-3">
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl">
              {c.images[0] && <Image src={c.images[0].url} alt={c.title} fill className="object-cover" sizes="150px" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{c.title}</p>
              <p className="text-sm font-bold text-primary">{formatKES(c.price)} <Badge variant={c.status === "ACTIVE" ? "success" : "secondary"}>{c.status}</Badge></p>
              <div className="mt-2 flex gap-2">
                <Link href={`/cars/${c.slug}`}><Button size="sm" variant="outline">View</Button></Link>
                {c.status !== "SOLD" && <form action={async () => { await markSoldAction(c.id); }}><Button size="sm" variant="secondary">Mark sold</Button></form>}
                <form action={async () => { await deleteListingAction(c.id); }}><Button size="sm" variant="ghost">Delete</Button></form>
              </div>
            </div>
          </div>
        ))}
        {cars.length === 0 && <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No listings yet. <Link href="/sell" className="text-primary underline">List your first car</Link>.</p>}
      </div>
    </div>
  );
}
