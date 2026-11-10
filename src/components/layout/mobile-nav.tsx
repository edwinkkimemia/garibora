"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BarChart3, Bell, CarFront, ChevronDown, HelpCircle, Heart, Info, KeyRound, Landmark, LayoutDashboard, LogOut, Menu, PlusCircle, BadgeCheck, Store, Tag, Wrench, X,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const primary = [
  { href: "/cars", label: "Buy a car", icon: CarFront },
  { href: "/rentals", label: "Rent a car", icon: KeyRound },
  { href: "/parts", label: "Car parts", icon: Wrench },
  { href: "/dealers", label: "Dealers", icon: Store },
];

const secondary = [
  { href: "/financing", label: "Financing", icon: Landmark },
  { href: "/insurance", label: "Insurance", icon: BadgeCheck },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/data", label: "Market data", icon: BarChart3 },
  { href: "/how-it-works", label: "How it works", icon: HelpCircle },
  { href: "/blog", label: "Insights", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export function MobileNav({ authed }: { authed: boolean }) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [counts, setCounts] = useState({ saved: 0, unread: 0 });
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    let live = true;
    fetch("/api/nav-counts", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live && d) setCounts({ saved: d.saved ?? 0, unread: d.unread ?? 0 }); })
      .catch(() => {});
    return () => { live = false; };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl hover:bg-accent">
        <Menu className="size-5" />
      </button>

      {mounted && open && createPortal(
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Close menu" onClick={close} className="absolute inset-0 bg-navy/50 backdrop-blur-sm" />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <Link href="/" onClick={close} aria-label="Motiva home">
                <Image src="/logo.png" alt="Motiva — Find your next drive" width={150} height={36} className="h-8 w-auto" />
              </Link>
              <button aria-label="Close menu" onClick={close} className="grid size-9 place-items-center rounded-xl hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <p className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Browse</p>
              <nav className="mt-2 grid gap-1">
                {primary.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-muted",
                      isActive(pathname, l.href) && "bg-muted text-navy"
                    )}
                  >
                    <span className="grid size-8 place-items-center rounded-lg bg-navy/5 text-gold-dark"><l.icon className="size-4" /></span>
                    {l.label}
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                className="mt-4 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-muted hover:text-navy"
              >
                <span>More options</span>
                <ChevronDown className={cn("size-4 transition", moreOpen && "rotate-180")} />
              </button>
              {moreOpen && (
                <nav className="mt-1 grid gap-0.5 border-l pl-3">
                  {secondary.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={close}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-slate-600 transition hover:bg-muted hover:text-navy"
                    >
                      <l.icon className="size-4 text-gold-dark" />{l.label}
                    </Link>
                  ))}
                </nav>
              )}

              <div className="mt-5 border-t pt-4">
                <p className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Account</p>
                {authed ? (
                  <div className="mt-2 grid gap-1">
                    <Link href="/dashboard" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-muted">
                      <span className="grid size-8 place-items-center rounded-lg bg-navy/5 text-gold-dark"><LayoutDashboard className="size-4" /></span>
                      Dashboard
                    </Link>
                    <Link href="/dashboard/notifications" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-muted">
                      <span className="grid size-8 place-items-center rounded-lg bg-navy/5 text-gold-dark"><Bell className="size-4" /></span>
                      Notifications
                      {counts.unread > 0 && (
                        <span className="ml-auto grid min-h-5 min-w-5 place-items-center rounded-full bg-navy px-1.5 text-[11px] font-extrabold text-gold-light">
                          {counts.unread > 9 ? "9+" : counts.unread}
                        </span>
                      )}
                    </Link>
                    <Link href="/favorites" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-muted">
                      <span className="grid size-8 place-items-center rounded-lg bg-navy/5 text-gold-dark"><Heart className="size-4" /></span>
                      Saved cars
                      {counts.saved > 0 && (
                        <span className="ml-auto grid min-h-5 min-w-5 place-items-center rounded-full bg-navy px-1.5 text-[11px] font-extrabold text-gold-light">
                          {counts.saved > 9 ? "9+" : counts.saved}
                        </span>
                      )}
                    </Link>
                    <form action={signOutAction}>
                      <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                        <span className="grid size-8 place-items-center rounded-lg bg-red-50"><LogOut className="size-4" /></span>
                        Sign out
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="mt-2 grid gap-2">
                    <Link href="/login" onClick={close}><Button variant="outline" className="w-full">Log in</Button></Link>
                    <Link href="/register" onClick={close}><Button className="w-full">Create account</Button></Link>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t bg-muted/30 p-4">
              <Link href="/sell" onClick={close}><Button className="w-full"><PlusCircle />Sell your car</Button></Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
