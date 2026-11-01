import Link from "next/link";
import { CarFront, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-lg">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><CarFront className="size-4" /></span>
            {siteConfig.brandName}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{siteConfig.tagline} {siteConfig.taglineAlt} Kenya&apos;s trusted marketplace for verified cars.</p>
          <p className="mt-3 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" /> Kiambu Road, Nairobi, Kenya</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Phone className="size-4" /> +254 700 000 000</p>
        </div>
        <div>
          <h4 className="font-semibold">Marketplace</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/cars" className="hover:text-foreground">All cars</Link></li>
            <li><Link href="/cars?bodyType=SUV" className="hover:text-foreground">SUVs</Link></li>
            <li><Link href="/cars?bodyType=PICKUP" className="hover:text-foreground">Pickups</Link></li>
            <li><Link href="/dealers" className="hover:text-foreground">Verified dealers</Link></li>
            <li><Link href="/sell" className="hover:text-foreground">Sell your car</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/how-it-works" className="hover:text-foreground">How it works</Link></li>
            <li><Link href="/blog" className="hover:text-foreground">Insights</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Payments we&apos;ll support</h4>
          <div className="mt-3 flex gap-2">
            <span className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white">M-PESA</span>
            <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white">Stripe</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Escrow + inspection coming soon. Never pay before viewing a car and logbook.</p>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.brandName}. Made for Kenya & East Africa. Prices in KES.
      </div>
    </footer>
  );
}
