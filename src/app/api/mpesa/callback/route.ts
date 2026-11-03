import prisma from "@/lib/prisma";
import { fulfillPayment } from "@/lib/fulfill";

/** Daraja C2B result callback — Safaricom posts here after the user acts. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      Body?: {
        stkCallback?: {
          MerchantRequestID?: string;
          CheckoutRequestID?: string;
          ResultCode?: number;
          ResultDesc?: string;
        };
      };
    };
    const cb = body?.Body?.stkCallback;
    console.log("[mpesa/callback]", JSON.stringify({ merchant: cb?.MerchantRequestID, checkout: cb?.CheckoutRequestID, code: cb?.ResultCode, desc: cb?.ResultDesc }));
    if (!cb?.CheckoutRequestID) return Response.json({ ok: false }, { status: 400 });

    await prisma.payment.updateMany({
      where: { checkoutRequestId: cb.CheckoutRequestID },
      data: { status: cb.ResultCode === 0 ? "COMPLETED" : cb.ResultCode === 1032 ? "CANCELLED" : "FAILED" },
    });
    if (cb.ResultCode === 0) {
      const done = await prisma.payment.findFirst({ where: { checkoutRequestId: cb.CheckoutRequestID }, select: { id: true } });
      if (done) await fulfillPayment(done.id).catch(() => ({ applied: false }));
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
