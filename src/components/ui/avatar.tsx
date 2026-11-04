/**
 * Universal avatar: real photo when uploaded, otherwise a branded
 * Motiva (navy + gold) initials mark generated on the fly.
 */
export function Avatar({
  src, name, className = "size-10",
}: {
  src?: string | null; name: string; className?: string;
}) {
  const fallback = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name || "?")}&backgroundColor=0c1f3f&fontColor=c9a24b`;
  return (
    <span className={`relative ${className} shrink-0 overflow-hidden rounded-full bg-navy`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src || fallback} alt="" className="h-full w-full object-cover" loading="lazy" />
    </span>
  );
}
