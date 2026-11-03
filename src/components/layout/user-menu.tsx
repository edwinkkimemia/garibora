"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront, ChevronDown, Heart, Inbox, LayoutDashboard, LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "My listings", icon: CarFront },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/favorites", label: "Saved cars", icon: Heart },
];

export function UserMenu({ name, email }: { name?: string | null; email?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials = (name ?? email ?? "U")
    .trim()
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const firstName = name?.trim().split(/\s+/)[0] || "Account";

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition hover:border-gold hover:bg-muted/50"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-extrabold text-gold-light">{initials}</span>
        <span className="max-w-24 truncate text-sm font-semibold">{firstName}</span>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition", open && "rotate-180")} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border bg-white shadow-xl">
          <div className="border-b bg-muted/40 px-4 py-3">
            <p className="truncate text-sm font-bold">{name || "Your account"}</p>
            {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
          </div>
          <div className="p-1.5">
            {items.map((it) => (
              <Link key={it.href} href={it.href} role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-muted hover:text-navy">
                <it.icon className="size-4 text-gold-dark" />{it.label}
              </Link>
            ))}
          </div>
          <form action={signOutAction} className="border-t p-1.5">
            <button type="submit" role="menuitem" className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
              <LogOut className="size-4" />Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
