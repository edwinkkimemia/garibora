"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { updateProfileAction } from "@/lib/actions";

export function ProfileForm({ user }: { user: { name: string | null; phone: string | null; idNumber: string | null } }) {
  const [state, action, pending] = useActionState(updateProfileAction, {} as { error?: string; ok?: boolean });
  return (
    <form action={action} className="space-y-3">
      <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" defaultValue={user.name ?? ""} required /></div>
      <div><Label htmlFor="phone">Phone / WhatsApp</Label><Input id="phone" name="phone" defaultValue={user.phone ?? ""} placeholder="0722…" /></div>
      <div>
        <Label htmlFor="idNumber">National ID / Passport (for seller verification)</Label>
        <Input id="idNumber" name="idNumber" defaultValue={user.idNumber ?? ""} placeholder="e.g. 12345678" />
        <p className="mt-1 text-xs text-muted-foreground">Only needed if you sell. Admin reviews within 24 hours.</p>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-green-700">Saved! ID submitted for review.</p>}
      <Button disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
    </form>
  );
}
