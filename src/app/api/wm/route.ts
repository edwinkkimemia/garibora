import { NextRequest } from "next/server";
import sharp from "sharp";
import path from "path";

export const runtime = "nodejs";
// Cache the composited result at the edge for a day (immutable per src+w).
export const revalidate = 86400;

// Hosts we are willing to proxy + stamp (prevents open-proxy abuse).
const ALLOW = [
  "images.unsplash.com",
  "res.cloudinary.com",
  "utfs.io",
  "ufs.sh",
  "motiva.co.ke",
  "www.motiva.co.ke",
  "garibora.vercel.app",
];

function allowed(host: string) {
  return ALLOW.some((h) => host === h || host.endsWith(`.${h}`));
}

/**
 * GET /api/wm?src=<absolute-url>&w=<width>
 * Serves the image with the Motiva wordmark baked into the bottom-right,
 * so right-click saves and shares carry the brand. Long edge-cached.
 */
export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src") || "";
  let url: URL;
  try {
    url = new URL(src);
    if (url.protocol !== "https:" || !allowed(url.hostname)) throw new Error("blocked");
  } catch {
    return new Response("Bad image URL", { status: 400 });
  }
  const w = Math.min(1600, Math.max(400, Number(req.nextUrl.searchParams.get("w")) || 1200));

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(url.toString(), { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error("fetch failed");
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 12_000_000) throw new Error("too large");

    const base = sharp(buf, { failOn: "none" }).rotate();
    const meta = await base.metadata();
    const W = Math.min(w, meta.width || w);
    const H = meta.width ? Math.round(((meta.height || 0) * W) / meta.width) : Math.round(W * 0.625);

    // Logo plate geometry (mirrors the client-side uploader stamp)
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const lw = Math.round(W * 0.22);
    const logoMeta = await sharp(logoPath).metadata();
    const lh = Math.round((lw * (logoMeta.height || 100)) / (logoMeta.width || 300));
    const m = Math.round(W * 0.03);
    const x = Math.max(0, W - lw - m);
    const y = Math.max(0, H - lh - m);
    const plate = Buffer.from(
      `<svg width="${lw + m}" height="${lh + m}"><rect x="0" y="0" width="${lw + m}" height="${lh + m}" rx="${Math.round(lw * 0.08)}" fill="white" fill-opacity="0.92"/></svg>`
    );
    const logoBuf = await sharp(logoPath).resize({ width: lw }).png().toBuffer();

    const out = await base
      .resize({ width: W, withoutEnlargement: true })
      .composite([
        { input: plate, left: Math.max(0, x - Math.round(m / 2)), top: Math.max(0, y - Math.round(m / 2)) },
        { input: logoBuf, left: x, top: y },
      ])
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    return new Response(new Uint8Array(out), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
      },
    });
  } catch {
    // Fail open to the original so pages never break over stamping.
    return Response.redirect(url.toString(), 302);
  }
}
