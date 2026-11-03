"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { partInquiryAction } from "@/lib/actions";

const initial = { error: "", ok: false } as { error?: string; ok?: boolean };

export function PartInquiryForm({ partId }: { partId: string }) {
  const [state, action, pending] = useActionState(async (_: unknown, fd: FormData) => partInquiryAction(_, fd), initial);

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="partId" value={partId} />
      <Input name="name" placeholder="Your name" required aria-label="Name" />
      <Input name="phone" placeholder="Phone e.g. 0722000000" required aria-label="Phone" />
      <Textarea
        name="message"
        placeholder="Is this part still available? Does it fit a…"
        required
        defaultValue="Is this part still available? Does it fit my car?"
        aria-label="Message"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-green-700">Sent! The seller will contact you shortly.</p>}
      <Button className="w-full" disabled={pending}>{pending ? "Sending…" : "Send enquiry"}</Button>
    </form>
  );
}
