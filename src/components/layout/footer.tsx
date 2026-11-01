import Link from "next/link";
import { CarFront, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site";

const popular = [
  { label: "Toyota Prado under 7M", href: "/cars?q=Prado&maxPrice=7000000" },
  { label: "Nissan Note Hybrid", href: "/cars?q=Note" },
  { label: "Toyota Hilux 4WD", href: "/cars?q=Hilux" },
  { label: "Mazda CX-5 Diesel", href: "/cars?make=Mazda&bodyType=SUV" },
  { label: "Mercedes C-Class", href: "/cars?make=Mercedes-Benz" },
  { label: "Cars under 1.5M", href: "/cars?maxPrice=1500000" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-slate-200">
      {/* gold rule */}
      <div className="h-1 bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" />
      <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-extrabold text-white">
            <span className="grid size-8 place-items-center rounded-lg bg-gold text-navy"><CarFront className="size-4" /></span>
            {siteConfig.brandName}
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold-light">KE</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{siteConfig.tagline} {siteConfig.taglineAlt} Kenya&apos;s trusted marketplace for verified cars.</p>
          <div className="mt-4 flex gap-2">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Youtube, label: "YouTube" },
            ].map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="grid size-9 place-items-center rounded-xl border border-white/15 bg-white/5 transition hover:border-gold hover:text-gold-light">
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="Marketplace">
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold-light">Marketplace</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/cars" className="hover:text-gold-light">All cars</Link></li>
            <li><Link href="/cars?bodyType=SUV" className="hover:text-gold-light">SUVs</Link></li>
            <li><Link href="/cars?bodyType=PICKUP" className="hover:text-gold-light">Pickups</Link></li>
            <li><Link href="/cars?condition=NEW" className="hover:text-gold-light">New cars</Link></li>
            <li><Link href="/dealers" className="hover:text-gold-light">Verified dealers</Link></li>
            <li><Link href="/sell" className="hover:text-gold-light">Sell your car</Link></li>
            <li><Link href="/blog" className="hover:text-gold-light">Buying guides</Link></li>
          </ul>
        </nav>
        <nav aria-label="Popular searches">
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold-light">Popular right now</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {popular.map((p) => <li key={p.label}><Link href={p.href} className="hover:text-gold-light">{p.label}</Link></li>)}
          </ul>
        </nav>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold-light">Talk to us</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-gold" /> Kiambu Road, Nairobi, Kenya</li>
            <li className="flex items-center gap-2"><Phone className="size-4 shrink-0 text-gold" /> +254 700 000 000</li>
            <li className="flex items-center gap-2"><Mail className="size-4 shrink-0 text-gold" /> hello@garibora.ke</li>
            <li className="flex items-center gap-2"><Clock className="size-4 shrink-0 text-gold" /> Mon–Sat, 8am–6pm EAT</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <span className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white">M-PESA</span>
            <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white">Stripe</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.brandName}. Made for Kenya & East Africa. Prices in KES.</p>
          <p className="flex gap-4">
            <Link href="/terms" className="hover:text-gold-light">Terms</Link>
            <Link href="/privacy" className="hover:text-gold-light">Privacy</Link>
            <Link href="/llms.txt" className="hover:text-gold-light">AI / llms.txt</Link>
            <Link href="/contact" className="hover:text-gold-light">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
