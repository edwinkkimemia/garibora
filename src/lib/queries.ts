import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { shuffle } from "@/lib/utils";
import { expandQuery, rankCarIds } from "@/lib/search";
import type { CarFilters } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 12;

/** IDs of cars the current user has wishlisted — request-cached, so cards can each read it with zero extra queries. */
export const getSavedCarIds = cache(async (): Promise<Set<string>> => {
  const session = await auth().catch(() => null);
  if (!session?.user?.id) return new Set<string>();
  const favs = await prisma.favorite
    .findMany({ where: { userId: session.user.id }, select: { carId: true } })
    .catch(() => []);
  return new Set(favs.map((f) => f.carId));
});

/** Navbar badges: wishlist size + unread notifications (0s when logged out). */
export const getNavCounts = cache(async (): Promise<{ saved: number; unread: number }> => {
  const session = await auth().catch(() => null);
  if (!session?.user?.id) return { saved: 0, unread: 0 };
  const [saved, unread] = await Promise.all([
    prisma.favorite.count({ where: { userId: session.user.id } }).catch(() => 0),
    prisma.notification.count({ where: { userId: session.user.id, read: false } }).catch(() => 0),
  ]);
  return { saved, unread };
});

/** Shared where-builder for cars (used by search, facets, saved-search matching). */
export function buildCarWhere(filters: CarFilters, opts?: { rentalOnly?: boolean }) {
  const where: Prisma.CarWhereInput = { status: "ACTIVE" };

  // Rentals live in their own vertical; sale search excludes rent-only stock
  where.listingType = opts?.rentalOnly ? { in: ["RENT", "BOTH"] } : { in: ["SALE", "BOTH"] };

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
  if (filters.tradeIn === "1" || filters.tradeIn === "true") where.tradeInAccepted = true;
  if (filters.financing === "1" || filters.financing === "true") where.financingAvailable = true;
  return where;
}

const carInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  dealer: { select: { businessName: true, logoUrl: true } },
  seller: { select: { name: true, image: true } },
};

export async function searchCars(filters: CarFilters, opts?: { rentalOnly?: boolean }) {
  const where = buildCarWhere(filters, opts);
  const page = Math.max(1, filters.page || 1);

  // Keyword path: typo-tolerant trigram retrieval + relevance ranking.
  const q = filters.q?.trim();
  if (q) {
    const terms = expandQuery(q);
    const ranked = await rankCarIds(terms, { listingType: opts?.rentalOnly ? "RENT" : "SALE", limit: 400 });
    if (ranked.length === 0) {
      return { cars: [], total: 0, page, pageSize: PAGE_SIZE, totalPages: 1, expanded: terms };
    }
    const rankOf = new Map(ranked.map((r, i) => [r.id, i] as const));
    const matched = await prisma.car.findMany({
      where: { ...where, id: { in: ranked.map((r) => r.id) } },
      include: carInclude,
    });
    // Relevance order, unless the user picked an explicit sort.
    if (!filters.sort || filters.sort === "newest") {
      matched.sort((a, b) => (rankOf.get(a.id) ?? 9999) - (rankOf.get(b.id) ?? 9999));
    } else if (filters.sort === "price-asc") matched.sort((a, b) => a.price - b.price);
    else if (filters.sort === "price-desc") matched.sort((a, b) => b.price - a.price);
    else if (filters.sort === "year-desc") matched.sort((a, b) => b.year - a.year);
    else if (filters.sort === "mileage-asc") matched.sort((a, b) => a.mileage - b.mileage);
    const total = matched.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const cars = matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return { cars, total, page, pageSize: PAGE_SIZE, totalPages, expanded: terms };
  }

  const orderBy: Prisma.CarOrderByWithRelationInput =
    filters.sort === "price-asc" ? { price: "asc" }
    : filters.sort === "price-desc" ? { price: "desc" }
    : filters.sort === "year-desc" ? { year: "desc" }
    : filters.sort === "mileage-asc" ? { mileage: "asc" }
    : { createdAt: "desc" };

  const [total, cars] = await Promise.all([
    prisma.car.count({ where }),
    prisma.car.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: carInclude,
    }),
  ]);

  // Default view reshuffles every refresh for discovery; explicit sorts + deep pages stay stable.
  const visible = filters.sort === "newest" && page === 1 ? shuffle(cars) : cars;
  return { cars: visible, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), expanded: [] as string[] };
}

/** Live counts for filter options (makes, body types, locations). */
export type Facet = { value: string; count: number };
export async function getSearchFacets(opts?: { rentalOnly?: boolean }) {
  const sale: Prisma.CarWhereInput["listingType"] = { in: ["SALE", "BOTH"] };
  const rent: Prisma.CarWhereInput["listingType"] = { in: ["RENT", "BOTH"] };
  const where = { status: "ACTIVE", listingType: opts?.rentalOnly ? rent : sale } as Prisma.CarWhereInput;
  const [makes, bodies, locations] = await Promise.all([
    prisma.car.groupBy({ by: ["make"], where, _count: true }),
    prisma.car.groupBy({ by: ["bodyType"], where, _count: true }),
    prisma.car.groupBy({ by: ["location"], where, _count: true }),
  ]);
  const sort = <T extends { _count: number }>(a: T[]) => a.sort((x, y) => y._count - x._count);
  return {
    makes: sort(makes).map((g) => ({ value: g.make, count: g._count })),
    bodyTypes: sort(bodies).map((g) => ({ value: String(g.bodyType), count: g._count })),
    locations: sort(locations).map((g) => ({ value: g.location, count: g._count })),
  };
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
