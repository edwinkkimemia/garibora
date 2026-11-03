import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, CarFront, Inbox, Send, PlusCircle, Settings, BadgeCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/dashboard");
  const me = await prisma.user.findUnique({ where: { id: session.user.id! }, select: { name: true, role: true, idVerified: true, verified: true } }).catch(() => null);
  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/listings", label: "My listings", icon: CarFront },
    { href: "/dashboard/inquiries", label: "Inquiries", icon: Inbox },
    { href: "/dashboard/requests", label: "My requests", icon: Send },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border bg-card p-4 shadow-sm lg:sticky lg:top-20">
          <div className="flex items-center gap-3 rounded-xl bg-navy p-3 text-white">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-sm font-extrabold text-navy">
              {(me?.name || "G").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{me?.name}</p>
              <p className="flex items-center gap-1 text-[11px] text-slate-300">
                {me?.role}
                {(me?.idVerified || me?.verified) && <BadgeCheck className="size-3 text-gold-light" />}
              </p>
            </div>
          </div>
          <nav className="mt-3 grid gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-accent")}>
                <l.icon className="size-4 text-gold-dark" />{l.label}
              </Link>
            ))}
          </nav>
          <Link href="/sell" className="mt-3 block"><Button className="w-full"><PlusCircle />New listing</Button></Link>
          {!(me?.idVerified || me?.verified) && (
            <Link href="/dashboard/settings" className="mt-2 block rounded-xl border border-dashed border-gold/60 bg-gold/10 p-3 text-xs font-semibold text-navy hover:bg-gold/20">
              Get verified — buyers contact verified sellers 3× more →
            </Link>
          )}
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
