import Link from "next/link";
import Image from "next/image";
import { Heart, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { auth } from "@/lib/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="h-0.5 bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" />
      <div className="container flex h-16 items-center justify-between gap-3 md:h-[76px]">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Motiva home">
          <span className="overflow-hidden rounded-lg">
            <Image src="/logo.png" alt="Motiva — Find your next drive" width={240} height={80} className="h-9 w-auto md:h-12" priority />
          </span>
        </Link>

        <DesktopNav />

        <div className="flex shrink-0 items-center gap-1.5">
          <form action="/cars" className="hidden items-center gap-2 rounded-full border bg-muted/40 px-3 py-2 transition focus-within:border-gold focus-within:bg-white xl:flex">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              name="q"
              aria-label="Search cars"
              placeholder="Search cars…"
              className="w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground 2xl:w-36"
            />
          </form>

          <Link href="/favorites" aria-label="Saved cars" title="Saved cars" className="hidden size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-muted hover:text-navy sm:grid">
            <Heart className="size-5" />
          </Link>

          {session?.user ? (
            <>
              <span className="hidden sm:block"><NotificationBell /></span>
              <UserMenu name={session.user.name} email={session.user.email} />
              <Link href="/sell">
                <Button size="sm" className="bg-gold text-navy hover:bg-gold-dark hover:text-white"><PlusCircle />Sell</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden h-9 items-center rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-muted hover:text-navy lg:inline-flex">
                Log in
              </Link>
              <Link href="/sell">
                <Button size="sm" className="bg-gold text-navy hover:bg-gold-dark hover:text-white"><PlusCircle />Sell</Button>
              </Link>
            </>
          )}

          <MobileNav authed={!!session?.user} />
        </div>
      </div>
    </header>
  );
}
