"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/cars", label: "Buy", icon: Search, match: (p: string) => p.startsWith("/cars") || p.startsWith("/parts") || p.startsWith("/rentals") },
  { href: "/sell", label: "Sell", icon: PlusCircle, match: () => false, fab: true },
  { href: "/favorites", label: "Saved", icon: Heart, match: (p: string) => p.startsWith("/favorites") },
  { href: "/dashboard", label: "Account", icon: User, match: (p: string) => p.startsWith("/dashboard") || p.startsWith("/profile") || p.startsWith("/login") },
];

/** Thumb-friendly bottom tab bar — mobile only. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary mobile" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.match(pathname);
          return (
            <Link key={t.href} href={t.href} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold">
              {t.fab ? (
                <span className="-mt-5 grid size-12 place-items-center rounded-full bg-gold text-navy shadow-lg ring-4 ring-white">
                  <t.icon className="size-6" />
                </span>
              ) : (
                <t.icon className={cn("size-5", active ? "text-gold-dark" : "text-slate-500")} />
              )}
              <span className={t.fab ? "text-navy" : active ? "text-gold-dark" : "text-slate-500"}>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
