import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes = ["", "/cars", "/sell", "/dealers", "/blog", "/about", "/how-it-works", "/contact"].map((r) => ({ url: `${base}${r}`, lastModified: new Date() }));
  try {
    const cars = await prisma.car.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true }, take: 500 });
    const carRoutes = cars.map((c) => ({ url: `${base}/cars/${c.slug}`, lastModified: c.updatedAt }));
    return [...staticRoutes, ...carRoutes];
  } catch {
    return staticRoutes;
  }
}
