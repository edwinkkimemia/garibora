import Link from "next/link";
import { Phone } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { whatsappLink } from "@/lib/utils";
import { markInquiryReadAction } from "@/lib/actions";

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const session = await auth();
  const { filter } = await searchParams;
  const unreadOnly = filter === "unread";
  const where = { car: { sellerId: session!.user!.id! }, ...(unreadOnly ? { read: false } : {}) };
  const [inquiries, total, unread] = await Promise.all([
    prisma.inquiry.findMany({
      where, include: { car: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" }, take: 50,
    }).catch(() => []),
    prisma.inquiry.count({ where: { car: { sellerId: session!.user!.id! } } }).catch(() => 0),
    prisma.inquiry.count({ where: { car: { sellerId: session!.user!.id! }, read: false } }).catch(() => 0),
  ]);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Inquiries" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl">Inquiries {unread > 0 && <Badge variant="success">{unread} unread</Badge>}</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/inquiries"><Button size="sm" variant={!unreadOnly ? "default" : "outline"}>All ({total})</Button></Link>
          <Link href="/dashboard/inquiries?filter=unread"><Button size="sm" variant={unreadOnly ? "default" : "outline"}>Unread ({unread})</Button></Link>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {inquiries.map((q) => (
          <Card key={q.id} className={q.read ? "" : "border-gold/60 bg-gold/5"}>
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{q.name} {!q.read && <Badge variant="success">New</Badge>}</p>
                  <p className="text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleString("en-KE")} • Re: <Link href={`/cars/${q.car.slug}`} className="font-semibold text-gold-dark hover:underline">{q.car.title}</Link></p>
                </div>
                {!q.read && (
                  <form action={async () => { "use server"; await markInquiryReadAction(q.id); }}>
                    <Button size="sm" variant="ghost">Mark read</Button>
                  </form>
                )}
              </div>
              <p className="mt-2 rounded-xl bg-muted/70 p-3 text-sm italic">&ldquo;{q.message}&rdquo;</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={whatsappLink(q.phone, `Hi ${q.name}, thanks for your interest in "${q.car.title}" on GariBora. When would you like to view it?`)} target="_blank" rel="noreferrer">
                  <Button size="sm" className="bg-[#25D366] hover:bg-[#1eb85a]"><WhatsAppIcon />Reply on WhatsApp</Button>
                </a>
                <a href={`tel:${q.phone}`}><Button size="sm" variant="outline"><Phone />{q.phone}</Button></a>
              </div>
            </CardContent>
          </Card>
        ))}
        {inquiries.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="font-bold">{unreadOnly ? "Inbox zero 🎉" : "No inquiries yet"}</p>
            <p className="mt-1 text-sm text-muted-foreground">Share your listings on WhatsApp and buyer messages land here instantly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
