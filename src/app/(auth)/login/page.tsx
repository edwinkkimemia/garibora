import { Suspense } from "react";
import Link from "next/link";
import { CarFront, BadgeCheck, MessageCircle, Banknote } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col justify-center py-4">
      <Breadcrumbs items={[{ label: "Log in" }]} />
      <div className="grid overflow-hidden rounded-3xl border bg-card shadow-sm lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-6 text-white lg:flex">
          <div className="absolute inset-0 opacity-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1000&auto=format&fit=crop" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/85 to-navy" />
          <div className="relative flex items-center gap-2 text-lg font-extrabold">
            <span className="grid size-8 place-items-center rounded-xl bg-gold text-navy"><CarFront className="size-4" /></span>
            {siteConfig.brandName}
          </div>
          <div className="relative">
            <p className="text-2xl font-extrabold leading-tight">Karibu back.<br /><span className="text-gold-light">Your gari awaits.</span></p>
            <ul className="mt-4 space-y-2 text-[13px] text-slate-200">
              <li className="flex items-center gap-2"><BadgeCheck className="size-4 shrink-0 text-gold-light" /> Saved cars synced on every device</li>
              <li className="flex items-center gap-2"><MessageCircle className="size-4 shrink-0 text-gold-light" /> WhatsApp sellers in one tap</li>
              <li className="flex items-center gap-2"><Banknote className="size-4 shrink-0 text-gold-light" /> Free listings for sellers & dealers</li>
            </ul>
          </div>
          <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} {siteConfig.brandName} • Nairobi, Kenya</p>
        </div>
        {/* Form */}
        <div className="p-5 md:p-7">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
            <LoginForm />
          </Suspense>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No account? <Link href="/register" className="font-semibold text-gold-dark hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
