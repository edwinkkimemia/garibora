import prisma from "@/lib/prisma";

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
    if (!cb?.CheckoutRequestID) return Response.json({ ok: false }, { status: 400 });

    await prisma.payment.updateMany({
      where: { checkoutRequestId: cb.CheckoutRequestID },
      data: { status: cb.ResultCode === 0 ? "COMPLETED" : cb.ResultCode === 1032 ? "CANCELLED" : "FAILED" },
    });
    // Activation (featured/plan) is done by the team on seeing COMPLETED —
    // see /admin or the pricing page. Auto-provisioning hooks in here as next step.
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
