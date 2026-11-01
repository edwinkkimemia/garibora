"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { inquiryAction } from "@/lib/actions";

const initial = { error: "", ok: false } as { error?: string; ok?: boolean };

export function InquiryForm({ carId }: { carId: string }) {
  const [state, action, pending] = useActionState(async (_: unknown, fd: FormData) => inquiryAction(_, fd), initial);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="carId" value={carId} />
      <Input name="name" placeholder="Your name" required aria-label="Name" />
      <Input name="phone" placeholder="Phone e.g. 0722000000" required aria-label="Phone" />
      <Textarea name="message" placeholder="Hi, is this still available? Can I view it in…?" required defaultValue="Hi, is this car still available? I'd like to arrange viewing." aria-label="Message" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-green-700">Sent! The seller will contact you shortly.</p>}
      <Button className="w-full" disabled={pending}>{pending ? "Sending…" : "Send inquiry"}</Button>
    </form>
  );
}
