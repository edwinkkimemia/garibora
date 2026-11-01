import Link from "next/link";
import { CarFront, Heart, PlusCircle, LayoutDashboard } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { auth } from "@/lib/auth";

const links = [
  { href: "/cars", label: "Buy a car" },
  { href: "/rentals", label: "Rentals" },
  { href: "/parts", label: "Parts" },
  { href: "/financing", label: "Financing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/dealers", label: "Dealers" },
];

export async function Navbar() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-navy">
          <span className="grid size-9 place-items-center rounded-xl bg-navy text-gold-light">
            <CarFront className="size-5" />
          </span>
          {siteConfig.brandName}
          <span className="hidden rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold-dark sm:inline">KE</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap hover:text-gold-dark">{l.label}</Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/favorites" aria-label="Saved cars" className="hidden size-10 place-items-center rounded-xl hover:bg-muted sm:grid">
            <Heart className="size-5" />
          </Link>
          {session?.user ? (
            <>
              <Link href="/dashboard"><Button variant="secondary" size="sm"><LayoutDashboard />Dashboard</Button></Link>
              <Link href="/sell" className="hidden sm:inline"><Button size="sm"><PlusCircle />Sell</Button></Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link href="/sell"><Button size="sm"><PlusCircle />Sell</Button></Link>
            </>
          )}
          <MobileNav authed={!!session?.user} />
        </div>
      </div>
    </header>
  );
}
