import Link from "next/link";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col justify-center py-4">
      <Breadcrumbs items={[{ label: "Reset password" }]} />
      <div className="grid overflow-hidden rounded-3xl border bg-card shadow-sm lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-6 text-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-800 to-navy" />
          <div className="relative flex items-center gap-2">
            <span className="overflow-hidden rounded-lg bg-white">
              <Image src="/logo.png" alt="Motiva — Find your next drive" width={140} height={34} className="h-8 w-auto" />
            </span>
          </div>
          <div className="relative">
            <p className="text-2xl font-extrabold leading-tight">Locked out?<br /><span className="text-gold-light">Back in a minute.</span></p>
            <p className="mt-3 flex items-start gap-2 text-[13px] text-slate-200"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-light" /> Reset links expire in 1 hour and work once, for your security.</p>
          </div>
          <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} {siteConfig.brandName}</p>
        </div>
        <div className="p-5 md:p-7">
          <h1 className="text-xl font-extrabold md:text-2xl">Reset password</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Enter your email — we&apos;ll send a reset link.</p>
          <form className="mt-4 space-y-2.5" action={async () => { "use server"; }}>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required placeholder="you@example.com" autoComplete="email" /></div>
            <Button className="w-full" size="lg">Send reset link</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">Remembered it? <Link href="/login" className="font-semibold text-gold-dark hover:underline">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
}
