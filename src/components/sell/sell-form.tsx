"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { listCarAction } from "@/lib/actions";
import { ImageUploader } from "@/components/upload/image-uploader";
import { siteConfig } from "@/config/site";

export function SellForm() {
  const [state, action, pending] = useActionState(listCarAction, { error: "" } as { error?: string });
  // Image uploads (Uploadthing when configured, else URL paste)
  // Image URLs are read from the ImageUploader hidden inputs
  const [images, setImages] = useState<string[]>([]);

  return (
    <form action={action} className="mt-6 space-y-5">
      <Card><CardContent className="grid gap-3 pt-5 md:grid-cols-2">
        <div className="md:col-span-2"><Label>Title</Label><Input name="title" required placeholder="e.g. 2019 Toyota Prado TX-L 2.8D — duty paid" /></div>
        <div><Label>Listing type</Label><Select name="listingType" defaultValue="SALE"><option value="SALE">For sale</option><option value="RENT">For hire</option><option value="BOTH">Sale + hire</option></Select></div>
        <div><Label>Daily hire rate (KES) — if for hire</Label><Input name="dailyRate" type="number" min={500} placeholder="e.g. 12000" /></div>
        <div><Label>Make</Label><Input name="make" required list="makes" placeholder="Toyota" /><datalist id="makes">{siteConfig.makes.map((m) => <option key={m} value={m} />)}</datalist></div>
        <div><Label>Model</Label><Input name="model" required placeholder="Land Cruiser Prado" /></div>
        <div><Label>Year</Label><Input name="year" type="number" required min={1995} max={2027} placeholder="2019" /></div>
        <div><Label>Price (KES)</Label><Input name="price" type="number" required min={50000} placeholder="6850000" /></div>
        <div><Label>Mileage (km)</Label><Input name="mileage" type="number" required min={0} placeholder="62000" /></div>
        <div><Label>Location</Label><Select name="location" required defaultValue="Nairobi">{siteConfig.locations.map((l) => <option key={l} value={l}>{l}</option>)}</Select></div>
        <div><Label>Transmission</Label><Select name="transmission" defaultValue="AUTOMATIC"><option value="AUTOMATIC">Automatic</option><option value="MANUAL">Manual</option><option value="CVT">CVT</option></Select></div>
        <div><Label>Fuel</Label><Select name="fuelType" defaultValue="DIESEL"><option value="PETROL">Petrol</option><option value="DIESEL">Diesel</option><option value="HYBRID">Hybrid</option><option value="ELECTRIC">Electric</option><option value="LPG">LPG</option></Select></div>
        <div><Label>Body type</Label><Select name="bodyType" defaultValue="SUV"><option value="SUV">SUV</option><option value="SEDAN">Sedan</option><option value="HATCHBACK">Hatchback</option><option value="PICKUP">Pickup</option><option value="COUPE">Coupe</option><option value="WAGON">Wagon</option><option value="VAN">Van</option><option value="TRUCK">Truck</option><option value="COMMERCIAL">Commercial</option></Select></div>
        <div><Label>Condition</Label><Select name="condition" defaultValue="FOREIGN_USED"><option value="NEW">New</option><option value="FOREIGN_USED">Foreign used</option><option value="LOCALLY_USED">Locally used</option></Select></div>
        <div><Label>Engine (cc)</Label><Input name="engineCc" type="number" placeholder="2800" /></div>
        <div><Label>Drive</Label><Select name="drive" defaultValue="4WD"><option value="2WD">2WD</option><option value="4WD">4WD</option><option value="AWD">AWD</option></Select></div>
        <div><Label>Color</Label><Input name="color" placeholder="Pearl White" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="negotiable" className="size-4" /> Negotiable</label>
        <div className="md:col-span-2"><Label>Description (min 30 chars)</Label><Textarea name="description" required minLength={30} placeholder="Service history, tyres, accident-free, reason for selling…" /></div>
      </CardContent></Card>

      <Card><CardContent className="pt-5">
        <ImageUploader images={images} setImages={setImages} />
      </CardContent></Card>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button size="lg" className="w-full" disabled={pending}>{pending ? "Submitting…" : "Submit for review"}</Button>
      <p className="text-center text-xs text-muted-foreground">By listing you confirm you own the car (or act for the owner) and the logbook is available.</p>
    </form>
  );
}
