import prisma from "@/lib/prisma";
import { shuffle } from "@/lib/utils";
import type { CarFilters } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 12;

export async function searchCars(filters: CarFilters, opts?: { rentalOnly?: boolean }) {
  const where: Prisma.CarWhereInput = { status: "ACTIVE" };

  // Rentals live in their own vertical; sale search excludes rent-only stock
  where.listingType = opts?.rentalOnly ? { in: ["RENT", "BOTH"] } : { in: ["SALE", "BOTH"] };

  if (filters.q) {
    // Prisma full-text-ish: case-insensitive contains across key fields.
    // For scale, swap with Meilisearch/Algolia; interface stays the same.
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { make: { contains: filters.q, mode: "insensitive" } },
      { model: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.make) where.make = { equals: filters.make, mode: "insensitive" };
  if (filters.model) where.model = { contains: filters.model, mode: "insensitive" };
  if (filters.location) where.location = filters.location;
  if (filters.transmission) where.transmission = filters.transmission as never;
  if (filters.fuelType) where.fuelType = filters.fuelType as never;
  if (filters.bodyType) where.bodyType = filters.bodyType as never;
  if (filters.condition) where.condition = filters.condition as never;
  if (filters.minPrice || filters.maxPrice)
    where.price = { gte: filters.minPrice, lte: filters.maxPrice };
  if (filters.minYear || filters.maxYear)
    where.year = { gte: filters.minYear, lte: filters.maxYear };
  if (filters.maxMileage) where.mileage = { lte: filters.maxMileage };

  const orderBy: Prisma.CarOrderByWithRelationInput =
    filters.sort === "price-asc" ? { price: "asc" }
    : filters.sort === "price-desc" ? { price: "desc" }
    : filters.sort === "year-desc" ? { year: "desc" }
    : filters.sort === "mileage-asc" ? { mileage: "asc" }
    : { createdAt: "desc" };

  const page = Math.max(1, filters.page || 1);
  const [total, cars] = await Promise.all([
    prisma.car.count({ where }),
    prisma.car.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { images: { orderBy: { sortOrder: "asc" } }, dealer: { select: { businessName: true, logoUrl: true } }, seller: { select: { name: true, image: true } } },
    }),
  ]);

  // Default view reshuffles every refresh for discovery; explicit sorts + deep pages stay stable.
  const visible = filters.sort === "newest" && page === 1 ? shuffle(cars) : cars;
  return { cars: visible, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getCarById(idOrSlug: string) {
  return prisma.car.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], status: { in: ["ACTIVE", "SOLD"] } },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      dealer: true,
      seller: { select: { id: true, name: true, phone: true, verified: true, idVerified: true, image: true } },
    },
  });
}

export async function getSimilarCars(carId: string, make: string, bodyType: string, listingType?: string) {
  const cars = await prisma.car.findMany({
    where: {
      status: "ACTIVE", id: { not: carId },
      listingType: listingType === "RENT" ? { in: ["RENT", "BOTH"] } : { in: ["SALE", "BOTH"] },
      OR: [{ make }, { bodyType: bodyType as never }],
    },
    take: 4,
    include: { images: true, dealer: { select: { businessName: true, logoUrl: true } }, seller: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
  return shuffle(cars);
}

/** Only boosts that haven't expired (null = organic/staff pick, always live). */
export function featuredLive(): Pick<Prisma.CarWhereInput, "featured" | "OR"> {
  return {
    featured: true,
    OR: [{ featuredUntil: null }, { featuredUntil: { gte: new Date() } }],
  };
}

export async function getFeaturedCars() {
  const cars = await prisma.car.findMany({
    where: { status: "ACTIVE", ...featuredLive() },
    take: 8,
    include: { images: true, dealer: { select: { businessName: true, logoUrl: true } }, seller: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
  return shuffle(cars);
}

/** Average price of comparable active cars (same make + model family). */
export async function getMarketInsight(make: string, model: string, excludeId: string) {
  const family = model.split(" ")[0];
  const agg = await prisma.car.aggregate({
    where: {
      status: "ACTIVE", id: { not: excludeId },
      make: { equals: make, mode: "insensitive" },
      model: { contains: family, mode: "insensitive" },
    },
    _avg: { price: true }, _count: { id: true },
  });
  return { avg: agg._avg.price ? Math.round(agg._avg.price) : null, count: agg._count.id };
}

/** Other active stock from the same dealer. */
export async function getDealerCars(dealerId: string, excludeId: string) {
  return prisma.car.findMany({
    where: { status: "ACTIVE", dealerId, id: { not: excludeId } },
    take: 4, include: { images: true, dealer: { select: { businessName: true, logoUrl: true } } },
    orderBy: { createdAt: "desc" },
  });
}

// ---------- Parts ----------
export type PartFilters = {
  q?: string; category?: string; condition?: string; location?: string;
  maxPrice?: number; sort?: "newest" | "price-asc" | "price-desc"; page?: number;
};

export async function searchParts(f: PartFilters) {
  const pageSize = 12;
  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (f.q) where.OR = [{ title: { contains: f.q, mode: "insensitive" } }];
  if (f.category) where.category = f.category;
  if (f.condition) where.condition = f.condition;
  if (f.location) where.location = f.location;
  if (f.maxPrice) where.price = { lte: f.maxPrice };
  const orderBy = f.sort === "price-asc" ? { price: "asc" } : f.sort === "price-desc" ? { price: "desc" } : { createdAt: "desc" };
  const page = Math.max(1, f.page || 1);
  const [total, parts] = await Promise.all([
    prisma.part.count({ where: where as never }),
    prisma.part.findMany({ where: where as never, orderBy: orderBy as never, skip: (page - 1) * pageSize, take: pageSize, include: { images: { orderBy: { sortOrder: "asc" } } } }),
  ]);
  const visible = (!f.sort || f.sort === "newest") && page === 1 ? shuffle(parts) : parts;
  return { parts: visible, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getPartBySlug(slug: string) {
  return prisma.part.findFirst({
    where: { slug, status: { in: ["ACTIVE", "SOLD"] } },
    include: { images: { orderBy: { sortOrder: "asc" } }, dealer: true, seller: { select: { id: true, name: true, phone: true, verified: true } } },
  });
}

/** Parts like this one (same category), plus more from the same seller. */
export async function getSimilarParts(partId: string, category: string) {
  const parts = await prisma.part.findMany({
    where: { status: "ACTIVE", id: { not: partId }, category: category as never },
    take: 4, include: { images: true }, orderBy: { createdAt: "desc" },
  });
  return shuffle(parts);
}

export async function getSellerParts(sellerId: string, excludeId: string) {
  const parts = await prisma.part.findMany({
    where: { status: "ACTIVE", sellerId, id: { not: excludeId } },
    take: 4, include: { images: true }, orderBy: { createdAt: "desc" },
  });
  return shuffle(parts);
}
