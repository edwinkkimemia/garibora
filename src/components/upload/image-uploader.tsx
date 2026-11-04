"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";
import { X, Link2, Loader2, Upload } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing-client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const enabled = process.env.NEXT_PUBLIC_UPLOADTHING_ENABLED === "true";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Stamps the Motiva wordmark at the bottom-right of a photo and
 * returns a JPEG ready for upload. All branding happens client-side,
 * so every stored image carries the watermark automatically.
 */
async function stampImage(file: File, logo: HTMLImageElement): Promise<File> {
  const bmp = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  const ctx = canvas.getContext("2d")!;

  // Photo + soft vignette at the bottom for legibility
  ctx.drawImage(bmp, 0, 0);
  const grad = ctx.createLinearGradient(0, canvas.height * 0.82, 0, canvas.height);
  grad.addColorStop(0, "rgba(12,31,63,0)");
  grad.addColorStop(1, "rgba(12,31,63,0.45)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, canvas.height * 0.82, canvas.width, canvas.height * 0.18);

  // Logo plate, bottom-right
  const lw = Math.round(canvas.width * 0.22);
  const lh = Math.round((lw * logo.naturalHeight) / logo.naturalWidth);
  const m = Math.round(canvas.width * 0.03);
  const x = canvas.width - lw - m;
  const y = canvas.height - lh - m;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  const r = Math.round(lw * 0.06);
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x - m / 2, y - m / 2, lw + m, lh + m, r);
    ctx.fill();
  } else {
    ctx.fillRect(x - m / 2, y - m / 2, lw + m, lh + m);
  }
  ctx.drawImage(logo, x, y, lw, lh);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + "-motiva.jpg", { type: "image/jpeg" });
}

/**
 * Photo uploader: direct UploadThing uploads when configured,
 * otherwise paste image URLs. Emits hidden `images` inputs.
 * Pass watermark={false} for official documents (IDs, certificates)
 * which must stay unaltered.
 */
export function ImageUploader({
  images, setImages, label = "Photos", max = 12, fieldName = "images", watermark = true, emptyHint,
}: {
  images: string[]; setImages: (u: string[]) => void;
  label?: string; max?: number; fieldName?: string; watermark?: boolean; emptyHint?: string;
}) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("carImageUploader", {
    onClientUploadComplete: (res) => {
      res.forEach((r) => add(r.url));
      setBusy("");
      if (inputRef.current) inputRef.current.value = "";
    },
    onUploadError: (e) => {
      setBusy("");
      if (inputRef.current) inputRef.current.value = "";
      alert(e.message.includes("token") ? "Upload not configured yet — paste an image URL instead, or set a valid UPLOADTHING_TOKEN." : `Upload failed: ${e.message}`);
    },
  });

  const add = (u: string) => {
    const clean = u.trim();
    if (clean && images.length < max && !images.includes(clean)) setImages([...images, clean]);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = [...files].filter((f) => f.type.startsWith("image/")).slice(0, max - images.length);
    if (picked.length === 0) return;
    try {
      let stamped = picked;
      if (watermark) {
        setBusy("Adding Motiva watermark…");
        const logo = await loadImage("/logo.png");
        stamped = await Promise.all(picked.map((f) => stampImage(f, logo)));
      }
      setBusy(`Uploading ${stamped.length} photo${stamped.length > 1 ? "s" : ""}…`);
      await startUpload(stamped);
    } catch {
      setBusy("");
      alert("Couldn't process that photo — try a JPG/PNG under 4MB, or paste a URL.");
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label>{label} ({images.length}/{max})</Label>
      {images.map((u) => <input key={u} type="hidden" name={fieldName} value={u} />)}

      {enabled ? (
        <div className="mt-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-gold-light transition hover:bg-navy-800">
            <Upload className="size-4" /> {isUploading || busy ? busy || "Uploading…" : watermark ? "Upload photos" : "Upload documents"}
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" disabled={isUploading} onChange={(e) => onFiles(e.target.files)} />
          </label>
          <p className="mt-1 text-xs text-muted-foreground">{watermark ? "Motiva watermark added automatically • " : "Documents are stored exactly as photographed • "}JPG/PNG up to 4MB each</p>
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
              <NextImage src={u} alt={`${watermark ? "Upload" : "Document"} ${i + 1}`} fill className="object-cover" sizes="150px" />
              {i === 0 && watermark && <span className="absolute left-1 top-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-navy">Cover</span>}
              <button type="button" aria-label="Remove" onClick={() => setImages(images.filter((x) => x !== u))}
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/70 text-white hover:bg-black"><X className="size-3" /></button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          {emptyHint ?? (watermark
            ? "Add at least 1 photo. Tip: exterior 360°, interior, dashboard mileage, engine bay."
            : "Add a clear, readable document — all corners visible, no glare.")}
        </p>
      )}
      {!enabled && (
        <p className="mt-2 text-xs text-muted-foreground">Direct uploads activate once UPLOADTHING_TOKEN is set (see README) — URL paste works meanwhile.</p>
      )}
    </div>
  );
}
