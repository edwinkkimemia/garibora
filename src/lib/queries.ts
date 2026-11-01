import prisma from "@/lib/prisma";
import type { CarFilters } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 12;

export async function searchCars(filters: CarFilters) {
  const where: Prisma.CarWhereInput = { status: "ACTIVE" };

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
      include: { images: { orderBy: { sortOrder: "asc" } }, dealer: true },
    }),
  ]);

  return { cars, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getCarById(idOrSlug: string) {
  return prisma.car.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], status: { in: ["ACTIVE", "SOLD"] } },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      dealer: true,
      seller: { select: { id: true, name: true, phone: true, verified: true } },
    },
  });
}

export async function getSimilarCars(carId: string, make: string, bodyType: string) {
  return prisma.car.findMany({
    where: { status: "ACTIVE", id: { not: carId }, OR: [{ make }, { bodyType: bodyType as never }] },
    take: 4,
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeaturedCars() {
  return prisma.car.findMany({
    where: { status: "ACTIVE", featured: true },
    take: 8,
    include: { images: true, dealer: true },
    orderBy: { createdAt: "desc" },
  });
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
    take: 4, include: { images: true },
    orderBy: { createdAt: "desc" },
  });
}
