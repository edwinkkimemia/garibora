import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CarCard } from "@/components/cars/car-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = { title: "My sent inquiries" };

export default async function RequestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/dashboard/requests");
  const sent = await prisma.inquiry.findMany({
    where: { buyerId: session.user.id },
    include: { car: { include: { images: true } } },
    orderBy: { createdAt: "desc" }, take: 30,
  }).catch(() => []);
  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Dashboard", href: "/dashboard" }, { label: "My requests" }]} />
      <h1 className="text-2xl font-extrabold">Cars I asked about ({sent.length})</h1>
      <div className="mt-5 grid gap-4">
        {sent.map((q) => (
          <div key={q.id} className="rounded-2xl border bg-card p-3">
            <p className="text-sm text-muted-foreground">{new Date(q.createdAt).toLocaleString("en-KE")} — you wrote:</p>
            <p className="mt-1 text-sm italic">&ldquo;{q.message}&rdquo;</p>
            <div className="mt-3"><CarCard car={q.car as never} view="list" /></div>
          </div>
        ))}
        {sent.length === 0 && <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No inquiries yet — open any car and tap Send inquiry.</p>}
      </div>
    </div>
  );
}
