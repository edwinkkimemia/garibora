"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav({ authed }: { authed: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button aria-label="Menu" onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl hover:bg-accent">
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-16 z-50 border-b bg-background p-4 shadow-lg">
          <nav className="grid gap-1 text-base font-medium" onClick={() => setOpen(false)}>
            <Link href="/cars" className="rounded-lg px-3 py-2 hover:bg-accent">Buy a car</Link>
            <Link href="/sell" className="rounded-lg px-3 py-2 hover:bg-accent">Sell your car</Link>
            <Link href="/dealers" className="rounded-lg px-3 py-2 hover:bg-accent">Dealers</Link>
            <Link href="/favorites" className="rounded-lg px-3 py-2 hover:bg-accent">Saved cars</Link>
            <Link href="/blog" className="rounded-lg px-3 py-2 hover:bg-accent">Insights</Link>
            <Link href="/how-it-works" className="rounded-lg px-3 py-2 hover:bg-accent">How it works</Link>
            {!authed && <Link href="/login"><Button className="mt-2 w-full">Log in / Sign up</Button></Link>}
            {authed && <Link href="/dashboard"><Button className="mt-2 w-full">Dashboard</Button></Link>}
          </nav>
        </div>
      )}
    </div>
  );
}
