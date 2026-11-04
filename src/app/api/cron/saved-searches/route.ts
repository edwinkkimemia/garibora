import { matchAllSavedSearches } from "@/lib/matcher";

/** Vercel Cron (daily). Requires CRON_SECRET bearer. */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await matchAllSavedSearches().catch((e) => ({ error: String(e) }));
  return Response.json({ ok: true, ...result });
}
