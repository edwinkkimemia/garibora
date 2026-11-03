import prisma from "@/lib/prisma";

const DAY = 24 * 3600 * 1000;

/**
 * Apply a completed purchase: boosts go live on the car, plans land on the
 * user. Idempotent — a payment is only ever fulfilled once.
 */
export async function fulfillPayment(paymentId: string): Promise<{ applied: boolean; kind?: string }> {
  const p = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!p || p.status !== "COMPLETED" || p.fulfilled) return { applied: false };

  if (p.purpose === "BOOST_FEATURED_7D" || p.purpose === "BOOST_TOP_3D") {
    const days = p.purpose === "BOOST_FEATURED_7D" ? 7 : 3;
    const updated = await prisma.car.updateMany({
      where: { id: p.reference },
      data: { status: "ACTIVE", verified: true, featured: true, featuredUntil: new Date(Date.now() + days * DAY) },
    });
    if (updated.count === 0) return { applied: false };
    await prisma.payment.update({ where: { id: p.id }, data: { fulfilled: true } });
    return { applied: true, kind: "boost" };
  }

  if (p.purpose === "PLAN_GROWTH" || p.purpose === "PLAN_PREMIUM") {
    if (!p.userId) return { applied: false };
    const plan = p.purpose === "PLAN_GROWTH" ? "GROWTH" : "PREMIUM";
    const me = await prisma.user.findUnique({ where: { id: p.userId }, select: { role: true } });
    await prisma.user.update({
      where: { id: p.userId },
      data: {
        plan, planUntil: new Date(Date.now() + 30 * DAY),
        ...(me && (me.role === "BUYER" || me.role === "SELLER") ? { role: "DEALER" } : {}),
      },
    });
    await prisma.payment.update({ where: { id: p.id }, data: { fulfilled: true } });
    return { applied: true, kind: "plan" };
  }

  return { applied: false };
}

/** Catch up any completed-but-unfulfilled payments (safety net). */
export async function fulfillPendingPayments(): Promise<number> {
  const pending = await prisma.payment.findMany({ where: { status: "COMPLETED", fulfilled: false }, select: { id: true } });
  let n = 0;
  for (const p of pending) {
    const r = await fulfillPayment(p.id).catch(() => ({ applied: false as const }));
    if (r.applied) n++;
  }
  return n;
}
