import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";
import { approveCarAction, rejectCarAction } from "@/lib/actions";

export const metadata = { title: "Admin — listing review" };

export default async function AdminListingsPage() {
  const queue = await prisma.car.findMany({
    where: { status: "PENDING" }, take: 30, orderBy: { createdAt: "desc" },
    include: { images: true, seller: { select: { name: true, email: true, phone: true, idVerified: true } } },
  }).catch(() => []);
  return (
    <div>
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Listing review" }]} />
      <h1 className="text-2xl font-extrabold">Review queue ({queue.length})</h1>
      <p className="mt-1 text-sm text-muted-foreground">Approving sets a car ACTIVE + verified. Check photos, price sanity and seller ID first.</p>
      <div className="mt-5 grid gap-3">
        {queue.map((c) => (
          <div key={c.id} className="flex flex-wrap gap-4 rounded-2xl border bg-card p-3">
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-muted">
              {c.images[0] && <Image src={c.images[0].url} alt={c.title} fill className="object-cover" sizes="150px" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm font-bold text-navy">{formatKES(c.price)} • {c.location} • {c.year}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Seller: {c.seller.name} ({c.seller.email}{c.seller.phone ? `, ${c.seller.phone}` : ""})
                {c.seller.idVerified ? " — ID verified ✓" : " — ID NOT verified"} •{" "}
                <Badge variant="outline">{c.listingType}</Badge>
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
              <div className="mt-2 flex gap-2">
                <form action={async () => { "use server"; await approveCarAction(c.id); }}><Button size="sm">Approve ✓</Button></form>
                <form action={async () => { "use server"; await rejectCarAction(c.id); }}><Button size="sm" variant="destructive">Reject</Button></form>
                <Link href={`/cars/${c.slug}`}><Button size="sm" variant="ghost">Preview</Button></Link>
              </div>
            </div>
          </div>
        ))}
        {queue.length === 0 && <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Queue clear. 🎉</p>}
      </div>
    </div>
  );
}
