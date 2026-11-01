"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function LoginPage() {
  const sp = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="container grid max-w-md py-12">
      <Breadcrumbs items={[{ label: "Log in" }]} />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <p className="text-sm text-muted-foreground">Log in to save cars and manage listings.</p>
          {sp.get("registered") && <p className="rounded-lg bg-green-50 p-2 text-sm text-green-700">Account created — please log in.</p>}
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>Continue with Google</Button>
          <div className="my-4 text-center text-xs text-muted-foreground">— or with email —</div>
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
              if (res?.error) setError("Invalid email or password.");
              else window.location.href = sp.get("next") || "/dashboard";
            }}
          >
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required placeholder="you@example.com" /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button className="w-full" disabled={busy}>{busy ? "Logging in…" : "Log in"}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No account? <Link href="/register" className="text-primary hover:underline">Sign up free</Link> •
            <Link href="/forgot-password" className="text-primary hover:underline"> Forgot password</Link>
          </p>
          <p className="mt-2 rounded-lg bg-muted p-2 text-center text-xs">Demo: seller@garibora.ke / Password123!</p>
        </CardContent>
      </Card>
    </div>
  );
}
