import { getNavCounts } from "@/lib/queries";

/** Single endpoint for nav badges: wishlist size + unread notifications. */
export async function GET() {
  const counts = await getNavCounts().catch(() => ({ saved: 0, unread: 0 }));
  return Response.json(counts);
}
