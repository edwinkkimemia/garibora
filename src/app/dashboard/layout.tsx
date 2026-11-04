import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, CarFront, Inbox, Send, PlusCircle, Settings, BadgeCheck, Crown, LogOut, BellRing, BookmarkCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { signOutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/dashboard");
  const me = await prisma.user.findUnique({ where: { id: session.user.id! }, select: { name: true, role: true, idVerified: true, dealerProfile: { select: { verified: true } } } }).catch(() => null);
  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/listings", label: "My listings", icon: CarFront },
    { href: "/dashboard/inquiries", label: "Inquiries", icon: Inbox },
    { href: "/dashboard/requests", label: "My requests", icon: Send },
    { href: "/dashboard/saved-searches", label: "Saved searches", icon: BookmarkCheck },
    { href: "/dashboard/notifications", label: "Notifications", icon: BellRing },
    { href: "/dashboard/plans", label: "Plans & billing", icon: Crown },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];
  const unverified = !(me?.idVerified || me?.dealerProfile?.verified || me?.role === "ADMIN");
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-6">
      <div className="grid gap-4 lg:grid-cols-[260px_1fr] lg:gap-6">
        <DashboardMobileNav unverified={unverified} />
        <aside className="hidden h-fit rounded-2xl border bg-card p-4 shadow-sm lg:sticky lg:top-20 lg:block">
          <div className="flex items-center gap-3 rounded-xl bg-navy p-3 text-white">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-sm font-extrabold text-navy">
              {(me?.name || "G").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{me?.name}</p>
              <p className="flex items-center gap-1 text-[11px] text-slate-300">
                {me?.role}
                {(me?.idVerified || me?.dealerProfile?.verified) && <BadgeCheck className="size-3 text-gold-light" />}
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
          {unverified && (
            <Link href="/dashboard/settings" className="mt-2 block rounded-xl border border-dashed border-gold/60 bg-gold/10 p-3 text-xs font-semibold text-navy hover:bg-gold/20">
              Get verified — buyers contact verified sellers 3× more →
            </Link>
          )}
          <form action={signOutAction} className="mt-3 border-t pt-3">
            <Button type="submit" variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"><LogOut />Sign out</Button>
          </form>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
