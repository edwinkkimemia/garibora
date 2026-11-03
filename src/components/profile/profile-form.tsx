"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { IdCard, FileBadge, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ImageUploader } from "@/components/upload/image-uploader";
import { updateProfileAction } from "@/lib/actions";

type Props = {
  user: {
    name: string | null; phone: string | null; idNumber: string | null; kraPin: string | null;
    idDocUrl: string | null; kraPinDocUrl: string | null; bizPermitUrl: string | null;
  };
};

function ExistingDoc({ url, label }: { url: string | null; label: string }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="relative block aspect-[16/10] overflow-hidden rounded-xl border">
      <Image src={url} alt={label} fill className="object-cover" sizes="200px" />
      <span className="absolute bottom-1 left-1 rounded-full bg-navy/85 px-2 py-0.5 text-[10px] font-bold text-gold-light">Submitted ✓ — tap to view</span>
    </a>
  );
}

/** Full KYC: personal details + national ID + KRA PIN + supporting documents. */
export function ProfileForm({ user }: Props) {
  const [state, action, pending] = useActionState(updateProfileAction, {} as { error?: string; ok?: boolean });
  const [idDoc, setIdDoc] = useState<string[]>([]);
  const [kraPinDoc, setKraPinDoc] = useState<string[]>([]);
  const [bizPermit, setBizPermit] = useState<string[]>([]);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" defaultValue={user.name ?? ""} required /></div>
        <div><Label htmlFor="phone">Phone / WhatsApp</Label><Input id="phone" name="phone" defaultValue={user.phone ?? ""} placeholder="0722…" /></div>
        <div><Label htmlFor="idNumber">National ID / Passport No.</Label><Input id="idNumber" name="idNumber" defaultValue={user.idNumber ?? ""} placeholder="e.g. 12345678" /></div>
        <div><Label htmlFor="kraPin">KRA PIN</Label><Input id="kraPin" name="kraPin" defaultValue={user.kraPin ?? ""} placeholder="e.g. A123456789Z" className="uppercase" /></div>
      </div>

      <div className="rounded-2xl border border-dashed p-4">
        <p className="flex items-center gap-2 text-sm font-bold"><IdCard className="size-4 text-gold-dark" /> ID document photo</p>
        <p className="text-xs text-muted-foreground">Clear photo of your national ID (front) or passport bio page.</p>
        {user.idDocUrl && !idDoc.length ? <div className="mt-2 max-w-[220px]"><ExistingDoc url={user.idDocUrl} label="ID document" /></div> : null}
        <div className="mt-2"><ImageUploader images={idDoc} setImages={setIdDoc} label="" max={1} fieldName="idDoc" /></div>
      </div>

      <div className="rounded-2xl border border-dashed p-4">
        <p className="flex items-center gap-2 text-sm font-bold"><FileBadge className="size-4 text-gold-dark" /> KRA PIN certificate</p>
        <p className="text-xs text-muted-foreground">Photo or PDF screenshot of your KRA PIN certificate.</p>
        {user.kraPinDocUrl && !kraPinDoc.length ? <div className="mt-2 max-w-[220px]"><ExistingDoc url={user.kraPinDocUrl} label="KRA PIN" /></div> : null}
        <div className="mt-2"><ImageUploader images={kraPinDoc} setImages={setKraPinDoc} label="" max={1} fieldName="kraPinDoc" /></div>
      </div>

      <div className="rounded-2xl border border-dashed p-4">
        <p className="flex items-center gap-2 text-sm font-bold"><Store className="size-4 text-gold-dark" /> Business permit <span className="font-normal text-muted-foreground">(dealers & commercial sellers)</span></p>
        <p className="text-xs text-muted-foreground">Single business permit or trade licence for your yard/shop.</p>
        {user.bizPermitUrl && !bizPermit.length ? <div className="mt-2 max-w-[220px]"><ExistingDoc url={user.bizPermitUrl} label="Business permit" /></div> : null}
        <div className="mt-2"><ImageUploader images={bizPermit} setImages={setBizPermit} label="" max={1} fieldName="bizPermit" /></div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm font-medium text-green-700">Saved! Documents submitted — review within 24 hours.</p>}
      <Button disabled={pending}>{pending ? "Saving…" : "Save & submit for verification"}</Button>
    </form>
  );
}
