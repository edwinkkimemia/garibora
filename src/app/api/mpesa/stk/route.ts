import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PRODUCTS, normalizePhone, stkPush } from "@/lib/mpesa";

/** Initiate an STK push. Body: { phone, purpose, reference }. Amount is set server-side. */
export async function POST(req: NextRequest) {
  try {
    const { phone, purpose, reference } = (await req.json()) as {
      phone?: string; purpose?: string; reference?: string;
    };
    const product = purpose ? PRODUCTS[purpose] : undefined;
    if (!product || !purpose) return Response.json({ error: "Unknown product." }, { status: 400 });

    const msisdn = normalizePhone(String(phone || ""));
    const session = await auth().catch(() => null);

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
