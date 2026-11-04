import Link from "next/link";
import { BellRing, CheckCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { markNotificationsReadAction } from "@/lib/actions";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const session = await auth();
  const items = await prisma.notification.findMany({
    where: { userId: session!.user!.id! }, orderBy: { createdAt: "desc" }, take: 50,
  }).catch(() => []);
  const unread = items.filter((n) => !n.read).length;
  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Notifications" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl">Notifications {unread > 0 && <span className="rounded-full bg-gold px-2.5 py-0.5 align-middle text-sm font-bold text-navy">{unread} new</span>}</h1>
        {unread > 0 && (
          <form action={async () => { "use server"; await markNotificationsReadAction(); }}>
            <Button size="sm" variant="outline"><CheckCheck />Mark all read</Button>
          </form>
        )}
      </div>
      <div className="mt-5 grid gap-3">
        {items.map((n) => (
          <Card key={n.id} className={n.read ? "" : "border-gold/60 bg-gold/5"}>
            <CardContent className="pt-4">
              <p className="font-bold">{n.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{n.body} • {new Date(n.createdAt).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              {n.link && <Link href={n.link} className="mt-2 inline-block text-sm font-bold text-gold-dark hover:underline">View matches →</Link>}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <BellRing className="mx-auto size-8 text-gold-dark" />
            <p className="mt-2 font-bold">All quiet</p>
            <p className="mt-1 text-sm text-muted-foreground"><Link href="/dashboard/saved-searches" className="font-semibold text-gold-dark hover:underline">Save a search</Link> and we&apos;ll notify you about fresh matches.</p>
          </div>
        )}
      </div>
    </div>
  );
}
