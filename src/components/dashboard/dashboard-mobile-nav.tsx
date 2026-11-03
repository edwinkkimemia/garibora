"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck, CarFront, Crown, Inbox, LayoutDashboard, LogOut, Send, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "Listings", icon: CarFront },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/dashboard/requests", label: "Requests", icon: Send },
  { href: "/dashboard/plans", label: "Plans", icon: Crown },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

/** Compact scrollable dashboard tabs for mobile, replacing the tall sidebar. */
export function DashboardMobileNav({ unverified = false }: { unverified?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border bg-card p-1.5 shadow-sm lg:hidden">
      <nav aria-label="Dashboard" className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((l) => {
          const active = l.href === "/dashboard" ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition",
                active ? "bg-navy text-white" : "text-slate-600 hover:bg-muted hover:text-navy"
              )}
            >
              <l.icon className={cn("size-3.5", active ? "text-gold-light" : "text-gold-dark")} />
              {l.label}
            </Link>
          );
        })}
        <form action={signOutAction} className="shrink-0 border-l pl-1">
          <button type="submit" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
            <LogOut className="size-3.5" />Sign out
          </button>
        </form>
      </nav>
      {unverified && (
        <Link href="/dashboard/settings" className="mx-1.5 mb-0.5 mt-2 flex items-center gap-1.5 rounded-lg bg-gold/10 px-2.5 py-1.5 text-[11px] font-semibold text-navy">
          <BadgeCheck className="size-3.5 shrink-0 text-gold-dark" />Get verified — buyers contact verified sellers 3× more →
        </Link>
      )}
    </div>
  );
}
