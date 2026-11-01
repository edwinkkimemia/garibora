"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CarFront, BadgeCheck, Banknote, KeyRound } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { registerAction } from "@/lib/actions";
import { siteConfig } from "@/config/site";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, { error: "" } as { error?: string });
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Sign up" }]} /></div>
      <div className="container pb-12">
        <div className="grid overflow-hidden rounded-3xl border bg-card shadow-sm lg:grid-cols-2">
          {/* Brand panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-8 text-white lg:flex">
            <div className="absolute inset-0 opacity-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/85 to-navy" />
            <div className="relative flex items-center gap-2 text-xl font-extrabold">
              <span className="grid size-9 place-items-center rounded-xl bg-gold text-navy"><CarFront className="size-5" /></span>
              {siteConfig.brandName}
            </div>
            <div className="relative">
              <p className="text-3xl font-extrabold leading-tight">Join 10,000+<br /><span className="text-gold-light">smart car owners.</span></p>
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2"><BadgeCheck className="size-4 shrink-0 text-gold-light" /> Save favourites & compare prices</li>
                <li className="flex items-center gap-2"><KeyRound className="size-4 shrink-0 text-gold-light" /> List your car free in ~3 minutes</li>
                <li className="flex items-center gap-2"><Banknote className="size-4 shrink-0 text-gold-light" /> Hire out your car for extra income</li>
              </ul>
            </div>
            <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} {siteConfig.brandName} • Nairobi, Kenya</p>
          </div>
          {/* Form */}
          <div className="p-6 md:p-10">
            <h1 className="text-2xl font-extrabold md:text-3xl">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Buy, save favourites, or sell your car — free.</p>
            <form action={action} className="mt-5 space-y-3">
              <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" required placeholder="Wanjiku Mwangi" autoComplete="name" /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label htmlFor="phone">Phone / WhatsApp</Label><Input id="phone" name="phone" placeholder="0722…" autoComplete="tel" /></div>
                <div><Label htmlFor="role">I am a…</Label>
                  <Select id="role" name="role" defaultValue="BUYER">
                    <option value="BUYER">Buyer</option>
                    <option value="SELLER">Private seller</option>
                    <option value="DEALER">Dealer / Yard</option>
                  </Select>
                </div>
              </div>
              <div><Label htmlFor="password">Password (min 8)</Label><Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" /></div>
              {state?.error && <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{state.error}</p>}
              <Button className="w-full" size="lg" disabled={pending}>{pending ? "Creating…" : "Sign up free"}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">Have an account? <Link href="/login" className="font-semibold text-gold-dark hover:underline">Log in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
