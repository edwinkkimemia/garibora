"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardCheck, Users, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/listings", label: "Review queue", icon: ClipboardCheck, exact: false },
  { href: "/admin/users", label: "Users & sellers", icon: Users, exact: false },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, exact: false },
  { href: "/dashboard/settings", label: "My settings", icon: Settings, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav className="grid gap-1">
      <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-gold-light/80">Admin console</p>
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href}
            className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active ? "bg-gold text-navy" : "text-slate-200 hover:bg-white/10 hover:text-white")}>
            <l.icon className="size-4 shrink-0" />{l.label}
          </Link>
        );
      })}
    </nav>
  );
}
