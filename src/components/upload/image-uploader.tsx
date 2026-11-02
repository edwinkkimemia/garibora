"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Link2, Loader2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing-client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const enabled = process.env.NEXT_PUBLIC_UPLOADTHING_ENABLED === "true";

/**
 * Photo uploader: direct UploadThing uploads when configured,
 * otherwise paste image URLs. Emits hidden `images` inputs for the parent form.
 */
export function ImageUploader({
  images, setImages, label = "Photos", max = 12, fieldName = "images",
}: {
  images: string[]; setImages: (u: string[]) => void;
  label?: string; max?: number; fieldName?: string;
}) {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const add = (u: string) => {
    const clean = u.trim();
    if (clean && images.length < max && !images.includes(clean)) setImages([...images, clean]);
  };

  return (
    <div>
      <Label>{label} ({images.length}/{max})</Label>
      {images.map((u) => <input key={u} type="hidden" name={fieldName} value={u} />)}

      {enabled ? (
        <div className="mt-2">
          <UploadButton
            endpoint="carImageUploader"
            appearance={{
              button: "rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-gold-light hover:bg-navy-800 ut-uploading:bg-navy-800",
              allowedContent: "text-xs text-muted-foreground",
            }}
            content={{ button: uploading ? "Uploading…" : "Upload photos", allowedContent: "Images up to 4MB each" }}
            onUploadBegin={() => setUploading(true)}
            onClientUploadComplete={(res) => {
              setUploading(false);
              res.forEach((r) => add(r.url));
            }}
            onUploadError={(e) => { setUploading(false); alert(`Upload failed: ${e.message}`); }}
          />
          {uploading && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="size-3 animate-spin" /> Uploading…</p>}
        </div>
      ) : (
        <div className="mt-2 flex gap-2">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste image URL — https://…" />
          <Button type="button" variant="secondary" onClick={() => { add(url); setUrl(""); }}><Link2 />Add</Button>
        </div>
      )}

      {images.length > 0 ? (
        <ul className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-4">
          {images.map((u, i) => (
            <li key={u} className="relative aspect-[4/3] overflow-hidden rounded-xl border">
              <Image src={u} alt={`Upload ${i + 1}`} fill className="object-cover" sizes="150px" />
              {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-navy">Cover</span>}
              <button type="button" aria-label="Remove photo" onClick={() => setImages(images.filter((x) => x !== u))}
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/70 text-white hover:bg-black"><X className="size-3" /></button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Add at least 1 photo. Tip: exterior 360°, interior, dashboard mileage, engine bay.</p>
      )}
      {!enabled && (
        <p className="mt-2 text-xs text-muted-foreground">Direct uploads activate once UPLOADTHING_TOKEN is set (see README) — URL paste works meanwhile.</p>
      )}
    </div>
  );
}
