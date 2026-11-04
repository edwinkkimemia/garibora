import prisma from "@/lib/prisma";
import { buildCarWhere } from "@/lib/queries";
import type { CarFilters } from "@/lib/validations";

/**
 * Daily matcher (Vercel Cron → /api/cron/saved-searches).
 * Finds cars listed since each search's last check and notifies owners.
 */
export async function matchAllSavedSearches(limit = 200): Promise<{ checked: number; notified: number }> {
  const searches = await prisma.savedSearch.findMany({ take: 500, orderBy: { createdAt: "asc" } });
  let notified = 0;
  const now = new Date();
  for (const s of searches.slice(0, limit)) {
    try {
      const filters = { ...(s.filters as Record<string, unknown>), sort: "newest", page: 1 } as unknown as CarFilters;
      const where = buildCarWhere(filters);
      const since = s.lastNotifiedAt ?? new Date(now.getTime() - 24 * 3600 * 1000);
      const matches = await prisma.car.findMany({
        where: { ...where, createdAt: { gt: since } },
        select: { id: true, title: true, price: true },
        take: 25,
      });
      if (matches.length > 0) {
        const first = matches[0];
        await prisma.notification.create({
          data: {
            userId: s.userId,
            title: `${matches.length} new match${matches.length > 1 ? "es" : ""} for “${s.name}”`,
            body: matches.length === 1 ? first.title : `${first.title} and ${matches.length - 1} more`,
            link: "/cars",
          },
        });
        notified++;
      }
      await prisma.savedSearch.update({ where: { id: s.id }, data: { lastNotifiedAt: now } });
    } catch {
      // one bad search must not block the rest
    }
  }
  return { checked: Math.min(searches.length, limit), notified };
}
