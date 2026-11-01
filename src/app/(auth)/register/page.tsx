"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerAction } from "@/lib/actions";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, { error: "" } as { error?: string });
  return (
    <div className="container grid max-w-md py-8">
      <Breadcrumbs items={[{ label: "Sign up" }]} />
      <Card>
        <CardHeader><CardTitle className="text-2xl">Create your account</CardTitle>
        <p className="text-sm text-muted-foreground">Buy, save favourites, or sell your car.</p></CardHeader>
        <CardContent>
          <form action={action} className="space-y-3">
            <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" required placeholder="Wanjiku Mwangi" /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required placeholder="you@example.com" /></div>
            <div><Label htmlFor="phone">Phone / WhatsApp</Label><Input id="phone" name="phone" placeholder="0722…" /></div>
            <div><Label htmlFor="password">Password (min 8)</Label><Input id="password" name="password" type="password" required minLength={8} /></div>
            <div><Label htmlFor="role">I am a…</Label>
              <Select id="role" name="role" defaultValue="BUYER">
                <option value="BUYER">Buyer</option>
                <option value="SELLER">Private seller</option>
                <option value="DEALER">Dealer / Yard</option>
              </Select>
            </div>
            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
            <Button className="w-full" disabled={pending}>{pending ? "Creating…" : "Sign up free"}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">Have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}
