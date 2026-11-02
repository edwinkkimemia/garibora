import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function baseMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${siteConfig.brandName} — ${siteConfig.tagline}`, template: `%s | ${siteConfig.brandName}` },
    description: siteConfig.description,
    keywords: [
      "cars for sale Kenya", "buy car Nairobi", "Motiva", "motiva.co.ke", "Toyota Prado Kenya price",
      "foreign used cars Kenya", "verified car dealers Kenya", "car prices KES",
      "Mombasa cars", "Kisumu cars", "Nakuru cars", "car loan Kenya", "NTSA logbook transfer",
    ],
    icons: { icon: "/fav.jpg", apple: "/fav.jpg" },
    openGraph: { type: "website", siteName: siteConfig.brandName, locale: "en_KE" },
    twitter: { card: "summary_large_image" },
    ...overrides,
  };
}

/** JSON-LD for a car (schema.org/Car) — used on detail pages for SEO. */
export function carJsonLd(car: {
  title: string; description: string; images: string[]; price: number; year: number;
  make: string; model: string; mileage: number; url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.title,
    description: car.description,
    image: car.images,
    url: car.url,
    vehicleModelDate: String(car.year),
    manufacturer: { "@type": "Organization", name: car.make },
    model: car.model,
    mileageFromOdometer: { "@type": "QuantitativeValue", value: car.mileage, unitCode: "KMT" },
    offers: { "@type": "Offer", priceCurrency: "KES", price: car.price, availability: "https://schema.org/InStock" },
  };
}
