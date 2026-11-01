import Link from "next/link";
import { CarFront, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Reset password" }]} /></div>
      <div className="container pb-12">
        <div className="grid overflow-hidden rounded-3xl border bg-card shadow-sm lg:grid-cols-2">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-8 text-white lg:flex">
            <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-800 to-navy" />
            <div className="relative flex items-center gap-2 text-xl font-extrabold">
              <span className="grid size-9 place-items-center rounded-xl bg-gold text-navy"><CarFront className="size-5" /></span>
              {siteConfig.brandName}
            </div>
            <div className="relative">
              <p className="text-3xl font-extrabold leading-tight">Locked out?<br /><span className="text-gold-light">Back in a minute.</span></p>
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-200"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> Reset links expire in 1 hour and work once, for your security.</p>
            </div>
            <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} {siteConfig.brandName}</p>
          </div>
          <div className="p-6 md:p-10">
            <h1 className="text-2xl font-extrabold md:text-3xl">Reset password</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter your email — we&apos;ll send a reset link.</p>
            <form className="mt-5 space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required placeholder="you@example.com" autoComplete="email" /></div>
              <Button className="w-full" size="lg">Send reset link</Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">Remembered it? <Link href="/login" className="font-semibold text-gold-dark hover:underline">Back to login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
