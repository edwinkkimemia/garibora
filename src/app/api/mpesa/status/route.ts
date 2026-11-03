import prisma from "@/lib/prisma";
import { queryStk } from "@/lib/mpesa";

/**
 * GET /api/mpesa/status?checkoutId=…[&refresh=1]
 * Without refresh: returns the stored status. With refresh=1: re-queries
 * Safaricom live first (covers delayed callbacks), then returns.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const checkoutId = searchParams.get("checkoutId") || "";
  const refresh = searchParams.get("refresh") === "1";
  if (!checkoutId) return Response.json({ error: "Missing checkoutId." }, { status: 400 });

  const p = await prisma.payment.findUnique({ where: { checkoutRequestId: checkoutId }, select: { status: true, amount: true, purpose: true } });
  if (!p) return Response.json({ error: "Not found." }, { status: 404 });

  if (refresh && p.status === "PENDING") {
    try {
      const live = await queryStk(checkoutId);
      if (live !== "PENDING") {
        await prisma.payment.update({ where: { checkoutRequestId: checkoutId }, data: { status: live } });
        return Response.json({ status: live, amount: p.amount, purpose: p.purpose, refreshed: true });
      }
    } catch {
      // fall through to stored status
    }
  }
  return Response.json({ status: p.status, amount: p.amount, purpose: p.purpose });
}
