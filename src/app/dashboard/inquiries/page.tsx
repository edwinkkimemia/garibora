import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export default async function InquiriesPage() {
  const session = await auth();
  const inquiries = await prisma.inquiry.findMany({
    where: { car: { sellerId: session!.user!.id! } },
    include: { car: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" }, take: 50,
  }).catch(() => []);
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Inquiries ({inquiries.length})</h1>
      <div className="mt-5 grid gap-3">
        {inquiries.map((q) => (
          <Card key={q.id}><CardContent className="pt-4 text-sm">
            <p><b>{q.name}</b> ({q.phone}) — <span className="text-muted-foreground">{new Date(q.createdAt).toLocaleString("en-KE")}</span></p>
            <p className="text-muted-foreground">Re: {q.car.title}</p>
            <p className="mt-1">{q.message}</p>
          </CardContent></Card>
        ))}
        {inquiries.length === 0 && <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No inquiries yet — share your listing on WhatsApp to get leads.</p>}
      </div>
    </div>
  );
}
