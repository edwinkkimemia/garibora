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

/** Compact dashboard menu for mobile, replacing the tall sidebar. */
export function DashboardMobileNav({ unverified = false }: { unverified?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border bg-card p-2 shadow-sm lg:hidden">
      <nav aria-label="Dashboard" className="grid grid-cols-3 gap-1">
        {links.map((l) => {
          const active = l.href === "/dashboard" ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-center text-[11px] font-semibold leading-tight transition",
                active ? "bg-navy text-white" : "text-slate-600 hover:bg-muted hover:text-navy"
              )}
            >
              <l.icon className={cn("size-4", active ? "text-gold-light" : "text-gold-dark")} />
              <span className="w-full truncate">{l.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 flex items-center justify-between gap-2 border-t pt-2">
        {unverified ? (
          <Link href="/dashboard/settings" className="flex min-w-0 items-center gap-1.5 rounded-lg bg-gold/10 px-2 py-1.5 text-[11px] font-semibold text-navy">
            <BadgeCheck className="size-3.5 shrink-0 text-gold-dark" />
            <span className="truncate">Get verified</span>
          </Link>
        ) : <span />}
        <form action={signOutAction} className="shrink-0">
          <button type="submit" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50">
            <LogOut className="size-3.5" />Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
