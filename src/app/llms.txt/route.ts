import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { formatKES } from "@/lib/utils";

// llms.txt — a machine-readable sitemap for AI assistants and crawlers.
// Standard: https://llmstxt.org — served as plain text, revalidated hourly.
export const revalidate = 3600;

export async function GET() {
  const base = siteConfig.url;
  let cars: { title: string; price: number; location: string; slug: string; year: number }[] = [];
  let dealers: { businessName: string; location: string; slug: string; rating: number }[] = [];
  let posts: { title: string; slug: string; excerpt: string | null }[] = [];
  try {
    [cars, dealers, posts] = await Promise.all([
      prisma.car.findMany({ where: { status: "ACTIVE" }, select: { title: true, price: true, location: true, slug: true, year: true }, orderBy: { createdAt: "desc" }, take: 120 }),
      prisma.dealer.findMany({ where: { verified: true }, select: { businessName: true, location: true, slug: true, rating: true }, orderBy: { rating: "desc" } }),
      prisma.post.findMany({ where: { published: true }, select: { title: true, slug: true, excerpt: true }, orderBy: { createdAt: "desc" } }),
    ]);
  } catch { /* serve the static shell even if DB is unreachable */ }

  const lines = [
    `# ${siteConfig.brandName} — ${siteConfig.tagline} ${siteConfig.taglineAlt}`,
    ``,
    `> ${siteConfig.description}`,
    `> Marketplace for Kenya & East Africa. Prices in Kenyan Shillings (KES). Contact sellers via WhatsApp.`,
    ``,
    `## Key pages`,
    `- Buy cars: ${base}/cars (filters: make, model, year, price, mileage, transmission, fuel, body type, condition, location)`,
    `- Sell your car (free listing): ${base}/sell
- Hire a car (rentals): ${base}/rentals
- Car financing & loan calculator: ${base}/financing
- Car insurance estimator: ${base}/insurance`,
    `- Verified dealers: ${base}/dealers`,
    `- Buying guides: ${base}/blog`,
    `- How it works: ${base}/how-it-works`,
    `- About: ${base}/about — Contact: ${base}/contact — Terms: ${base}/terms — Privacy: ${base}/privacy`,
    ``,
    `## Trust & process`,
    `- Sellers are ID + location verified; inspected cars carry a verification badge.`,
    `- Always verify the logbook on NTSA TIMS and confirm duty-paid status before paying.`,
    `- Popular towns: ${siteConfig.locations.join(", ")}.`,
    `- Popular makes: ${siteConfig.makes.join(", ")}.`,
    ``,
    `## Live listings (${cars.length}) — title | price KES | town | url`,
    ...cars.map((c) => `- ${c.title} | ${formatKES(c.price)} | ${c.location} | ${base}/cars/${c.slug}`),
    ``,
    `## Verified dealers (${dealers.length})`,
    ...dealers.map((d) => `- ${d.businessName} (${d.location}, rating ${d.rating.toFixed(1)}) | ${base}/dealers/${d.slug}`),
    ``,
    `## Guides (${posts.length})`,
    ...posts.map((p) => `- ${p.title} | ${base}/blog/${p.slug}`),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
