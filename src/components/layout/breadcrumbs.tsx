import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb as a continuation of the header: full-bleed navy→gold
 * gradient strip, flush under the navbar, car image fading in right.
 * Last item is the current page. (Parent page containers use py-8;
 * the -mt-8 pulls the strip flush to the header.)
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="relative left-1/2 -mt-8 mb-6 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-r from-navy via-navy-800 to-navy-600 shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-44 sm:w-72" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover opacity-50"
          sizes="300px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-800 via-navy-800/40 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gold to-transparent" aria-hidden />
      <div className="container relative">
        <ol className="flex flex-wrap items-center gap-1 py-3 text-[13px] text-slate-200">
          <li>
            <Link href="/" className="flex items-center gap-1 rounded px-1 py-0.5 transition hover:text-gold-light">
              <Home className="size-3.5" />Home
            </Link>
          </li>
          {items.map((it) => (
            <li key={it.label} className="flex min-w-0 items-center gap-1">
              <ChevronRight className="size-3.5 shrink-0 text-gold/70" aria-hidden />
              {it.href ? (
                <Link href={it.href} className="rounded px-1 py-0.5 transition hover:text-gold-light">{it.label}</Link>
              ) : (
                <span aria-current="page" className="max-w-[220px] truncate px-1 py-0.5 font-semibold text-gold-light sm:max-w-md">{it.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
