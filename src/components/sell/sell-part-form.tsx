"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploader } from "@/components/upload/image-uploader";
import { listPartAction } from "@/lib/actions";
import { siteConfig } from "@/config/site";

const categories = [
  ["TYRES_WHEELS", "Tyres & wheels"], ["BATTERY", "Battery"], ["BRAKES", "Brakes"],
  ["SUSPENSION", "Suspension"], ["ENGINE", "Engine"], ["ELECTRICAL", "Electrical"],
  ["BODY", "Body & lights"], ["ACCESSORIES", "Accessories"], ["OILS_FLUIDS", "Oils & fluids"],
];

export function SellPartForm() {
  const [state, action, pending] = useActionState(listPartAction, { error: "" } as { error?: string });
  const [images, setImages] = useState<string[]>([]);

  return (
    <form action={action} className="mt-6 space-y-5">
      <Card><CardContent className="grid gap-3 pt-5 md:grid-cols-2">
        <div className="md:col-span-2"><Label>Title</Label><Input name="title" required placeholder="e.g. Front brake pads — Toyota Fielder" /></div>
        <div><Label>Category</Label><Select name="category" defaultValue="BRAKES">{categories.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></div>
        <div><Label>Condition</Label><Select name="condition" defaultValue="NEW"><option value="NEW">New</option><option value="USED">Used</option><option value="REFURBISHED">Refurbished</option></Select></div>
        <div><Label>Price (KES)</Label><Input name="price" type="number" required min={100} placeholder="6500" /></div>
        <div><Label>Location</Label><Select name="location" defaultValue="Nairobi">{siteConfig.locations.map((l) => <option key={l} value={l}>{l}</option>)}</Select></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="negotiable" className="size-4" /> Negotiable</label>
        <div className="md:col-span-2"><Label>Fitment & details (min 20 chars)</Label><Textarea name="description" required minLength={20} placeholder="Fits NZE141/NZE161 Fielder & Axio. Ceramic pads with shims…" /></div>
      </CardContent></Card>
      <Card><CardContent className="pt-5">
        <ImageUploader images={images} setImages={setImages} label="Part photos" max={8} />
      </CardContent></Card>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button size="lg" className="w-full" disabled={pending}>{pending ? "Submitting…" : "Submit part for review"}</Button>
    </form>
  );
}
