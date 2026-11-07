/**
 * Universal avatar: real photo when uploaded, otherwise a branded
 * Motiva (navy + gold) initial mark rendered as an inline SVG —
 * zero network requests, works everywhere, always on-brand.
 */
export function Avatar({
  src, name, className = "size-10",
}: {
  src?: string | null; name: string; className?: string;
}) {
  const initial = (name.trim().charAt(0) || "?").toUpperCase();
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>` +
    `<rect width='64' height='64' rx='32' fill='#0C1F3F'/>` +
    `<text x='32' y='43' font-family='Arial,Helvetica,sans-serif' font-size='30' font-weight='700' fill='#C9A24B' text-anchor='middle'>${initial}</text></svg>`;
  const fallback = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return (
    <span className={`relative ${className} shrink-0 overflow-hidden rounded-full bg-navy`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src || fallback} alt="" className="h-full w-full object-cover" loading="lazy" />
    </span>
  );
}
