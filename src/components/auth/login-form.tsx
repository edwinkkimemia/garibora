"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm() {
  const sp = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-extrabold md:text-3xl">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Log in to save cars and manage listings.</p>
      {sp.get("registered") && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">Account created — please log in.</p>}
      {sp.get("error") && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">Session expired — please log in again.</p>}

      {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
        <>
          <Button variant="outline" className="mt-5 w-full" onClick={() => signIn("google", { callbackUrl: sp.get("next") || "/dashboard" })}>
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" /><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" /></svg>
            Continue with Google
          </Button>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" /></div>
        </>
      )}
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault(); setBusy(true); setError("");
          const fd = new FormData(e.currentTarget);
          const res = await signIn("credentials", {
            email: String(fd.get("email")), password: String(fd.get("password")),
            callbackUrl: sp.get("next") || "/dashboard", redirect: false,
          });
          setBusy(false);
          if (res?.error) {
            setError(
              res.error === "Configuration"
                ? "Server sign-in is misconfigured (missing AUTH_SECRET). Please tell support."
                : res.error === "AccessDenied"
                  ? "This account can't sign in that way — try email login."
                  : "Invalid email or password."
            );
          } else window.location.href = sp.get("next") || "/dashboard";
        }}
      >
        <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required autoComplete="current-password" /></div>
        <div className="text-right text-sm"><Link href="/forgot-password" className="font-medium text-gold-dark hover:underline">Forgot password?</Link></div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
        <Button className="w-full" size="lg" disabled={busy}><LogIn />{busy ? "Logging in…" : "Log in"}</Button>
      </form>
      <p className="mt-4 rounded-xl bg-muted p-3 text-center text-xs text-muted-foreground">Demo seller: seller@garibora.ke / Password123!</p>
    </div>
  );
}
