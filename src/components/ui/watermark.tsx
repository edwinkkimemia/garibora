/**
 * Display-time Motiva watermark for photos uploaded before auto-stamping.
 * Photos whose URL contains "-motiva." were already stamped at upload
 * time, so the overlay is skipped for those (no double mark).
 */
export function needsOverlay(url: string) {
  return !url.includes("-motiva.");
}

export function Watermark({ url, size = "md" }: { url: string; size?: "sm" | "md" }) {
  if (!needsOverlay(url)) return null;
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute bottom-2 right-2 overflow-hidden rounded-md bg-white/90 shadow ${size === "sm" ? "px-1 py-0.5" : "px-1.5 py-1"}`}
    >
      {/* plain img: tiny local asset, no optimization needed */}
      <img src="/logo.png" alt="" className={size === "sm" ? "h-3 w-auto" : "h-4 w-auto"} />
    </span>
  );
}
