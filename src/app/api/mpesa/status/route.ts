import prisma from "@/lib/prisma";

/** Polled by the pay button: ?checkoutId=… → { status }. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const checkoutId = searchParams.get("checkoutId") || "";
  if (!checkoutId) return Response.json({ error: "Missing checkoutId." }, { status: 400 });
  const p = await prisma.payment.findUnique({ where: { checkoutRequestId: checkoutId }, select: { status: true, amount: true, purpose: true } });
  if (!p) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ status: p.status, amount: p.amount, purpose: p.purpose });
}
