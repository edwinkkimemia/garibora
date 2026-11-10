"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/cars", label: "Buy a car" },
  { href: "/rentals", label: "Rentals" },
  { href: "/parts", label: "Parts" },
  { href: "/financing", label: "Financing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/dealers", label: "Dealers" },
  { href: "/data", label: "Market data" },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "relative rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted",
              active ? "text-navy" : "text-slate-600 hover:text-navy"
            )}
          >
            {l.label}
            {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold" />}
          </Link>
        );
      })}
    </nav>
  );
}
