"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/cars", label: "Buy a car" },
  { href: "/rentals", label: "Rent a car" },
  { href: "/parts", label: "Car parts" },
  { href: "/financing", label: "Financing" },
  { href: "/pricing", label: "Pricing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/sell", label: "Sell your car" },
  { href: "/dealers", label: "Dealers" },
  { href: "/favorites", label: "Saved cars" },
  { href: "/blog", label: "Insights" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

export function MobileNav({ authed }: { authed: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button aria-label="Menu" onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl hover:bg-accent">
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-16 z-50 max-h-[80vh] overflow-y-auto border-b bg-background p-4 shadow-lg">
          <nav className="grid gap-1 text-base font-medium" onClick={() => setOpen(false)}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 hover:bg-accent">{l.label}</Link>
            ))}
            {!authed && <Link href="/login"><Button className="mt-2 w-full">Log in / Sign up</Button></Link>}
            {authed && <Link href="/dashboard"><Button className="mt-2 w-full">Dashboard</Button></Link>}
          </nav>
        </div>
      )}
    </div>
  );
}
