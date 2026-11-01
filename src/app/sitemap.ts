import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes = [
    "", "/cars", "/rentals", "/parts", "/financing", "/insurance", "/sell", "/dealers", "/blog", "/about",
    "/how-it-works", "/contact", "/terms", "/privacy",
    "/login", "/register", "/favorites",
  ].map((r) => ({ url: `${base}${r}`, lastModified: new Date() }));
  try {
    const [cars, dealers, posts] = await Promise.all([
      prisma.car.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true }, take: 1000 }),
      prisma.dealer.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...staticRoutes,
      ...cars.map((c) => ({ url: `${base}/cars/${c.slug}`, lastModified: c.updatedAt })),
      ...dealers.map((d) => ({ url: `${base}/dealers/${d.slug}`, lastModified: d.updatedAt })),
      ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt })),
    ];
  } catch {
    return staticRoutes;
  }
}
