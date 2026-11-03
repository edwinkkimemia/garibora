import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PRODUCTS, normalizePhone, stkPush } from "@/lib/mpesa";

const PLAN_WINDOW_MS = 30 * 24 * 3600 * 1000;
const planExpiry = (since: Date) => new Date(since.getTime() + PLAN_WINDOW_MS);
const fmtDate = (d: Date) => d.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

/** Initiate an STK push. Body: { phone, purpose, reference }. Amount is set server-side. */
export async function POST(req: NextRequest) {
  try {
    const { phone, purpose, reference } = (await req.json()) as {
      phone?: string; purpose?: string; reference?: string;
    };
    const product = purpose ? PRODUCTS[purpose] : undefined;
    if (!product || !purpose) return Response.json({ error: "Unknown product." }, { status: 400 });
    const ref = String(reference || "general").slice(0, 100);

    const msisdn = normalizePhone(String(phone || ""));
    const session = await auth().catch(() => null);

    // No double boosts: a car with a live boost can't be boosted again.
    if ((purpose === "BOOST_FEATURED_7D" || purpose === "BOOST_TOP_3D") && ref !== "general") {
      const car = await prisma.car.findUnique({ where: { id: ref }, select: { sellerId: true, featured: true, featuredUntil: true } });
      if (!car || (session?.user?.id && car.sellerId !== session.user.id)) {
        return Response.json({ error: "Listing not found." }, { status: 404 });
      }
      if (car.featured && (!car.featuredUntil || new Date(car.featuredUntil) > new Date())) {
        const till = car.featuredUntil ? fmtDate(new Date(car.featuredUntil)) : "no expiry";
        return Response.json({ error: `Already boosted (active till ${till}). Renew after it ends.` }, { status: 400 });
      }
    }

    // No overlapping plans: one active plan at a time (30-day window).
    if (purpose === "PLAN_GROWTH" || purpose === "PLAN_PREMIUM") {
      const since = new Date(Date.now() - PLAN_WINDOW_MS);
      const existing = await prisma.payment.findFirst({
        where: { userId: session?.user?.id ?? undefined, purpose: { in: ["PLAN_GROWTH", "PLAN_PREMIUM"] }, status: "COMPLETED", createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
      });
      if (existing) {
        return Response.json({ error: `You already have an active plan till ${fmtDate(planExpiry(new Date(existing.createdAt)))}.` }, { status: 400 });
      }
    }

    const payment = await prisma.payment.create({
      data: {
        userId: session?.user?.id ?? null,
        phone: msisdn,
        amount: product.amount,
        purpose,
        reference: String(reference || "general").slice(0, 100),
      },
    });

    const { merchantRequestId, checkoutRequestId } = await stkPush({
      phone: msisdn,
      amount: product.amount,
      accountRef: payment.id.slice(-10).toUpperCase(),
      description: product.label,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { merchantRequestId, checkoutRequestId },
    });

    return Response.json({ ok: true, checkoutRequestId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Payment failed to start.";
    const status = /not configured/i.test(message) ? 503 : 400;
    return Response.json({ error: message }, { status });
  }
}
