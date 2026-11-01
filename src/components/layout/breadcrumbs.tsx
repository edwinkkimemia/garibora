import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; href?: string };

/** Premium breadcrumb with home icon + gold hover. Last item is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <li>
          <Link href="/" className="flex items-center gap-1 rounded-md px-1 py-0.5 transition hover:text-gold-dark">
            <Home className="size-3.5" />Home
          </Link>
        </li>
        {items.map((it) => (
          <li key={it.label} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="size-3.5 shrink-0 text-gold/60" aria-hidden />
            {it.href ? (
              <Link href={it.href} className="rounded-md px-1 py-0.5 transition hover:text-gold-dark">{it.label}</Link>
            ) : (
              <span aria-current="page" className="truncate px-1 py-0.5 font-semibold text-foreground">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
